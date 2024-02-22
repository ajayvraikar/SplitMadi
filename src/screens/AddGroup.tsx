import {
  Dimensions,
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Header from "../components/Header";
import GenericInput from "../components/GenericInput";
import GenericButton from "../components/GenericButton";
import CurrencyPicker from "../components/CurrencyPicker";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import firestore from "@react-native-firebase/firestore";
import {
  generateGroupId,
  getCurrentTime,
  showToast,
} from "../utils/genericUtils";
import { getDataFromAsync, LOGIN_USER_DATA } from "../utils/asyncStorageUtils";
import { UsersDataInterFace } from "../utils/interfaces";
import { useIsFocused } from "@react-navigation/native";
import { NativeModules } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CANCEL, EDIT, PLUS } from "../assets/Images";
import { FlatList } from "react-native-gesture-handler";
import HighlightedSubstring from "../components/HighlightWord";
import EditAddMember from "../components/EditAddMember";
import { GroupUsersInterFace } from "../redux/types/groups.types";
import useDebounce from "../hooks/useDebounce";

interface GroupDetailsProps {
  onFocus: () => void;
  groupName: string;
  setGroupName?: any;
  groupDes?: string;
  setGroupDes?: any;
  setIsEnabled?: any;
  isEnabled?: boolean;
  currencyPickerRef?: any;
  selectedCurrency?: any;
}
const GroupDetails: React.FC<GroupDetailsProps> = ({
  onFocus,
  groupName,
  setGroupName,
  groupDes,
  setGroupDes,
  setIsEnabled,
  selectedCurrency,
  isEnabled,
  currencyPickerRef,
}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      onFocus();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          marginTop: 16,
          width: Dimensions.get("screen").width,
        }}
      >
        <GenericInput
          customMainStyle={{ marginBottom: 20 }}
          title="Group Name"
          placeholder="Enter Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <GenericInput
          title="Group Description"
          placeholder="Enter Group Description"
          value={groupDes}
          onChangeText={setGroupDes}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setIsEnabled(!isEnabled)}
          style={styles.shareView}
        >
          <Text style={styles.shareTxt}>Share online</Text>
          <Switch
            style={styles.switchBtn}
            trackColor={{ false: "lightblue", true: "#81f0ff" }}
            thumbColor={isEnabled ? "#2faff5" : "#f4f3f4"}
            onValueChange={() => setIsEnabled(!isEnabled)}
            value={isEnabled}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            currencyPickerRef?.current?.present();
          }}
          style={{
            ...styles.shareView,
            marginTop: 12,
          }}
        >
          <Text style={styles.shareTxt}>Currency</Text>
          <View style={styles.currencyValueView}>
            <View style={{ borderWidth: 0.4 }}>
              <Image
                style={styles.flagImage}
                source={{ uri: selectedCurrency.flagURL }}
              />
            </View>

            <Text style={styles.curSymbol}>{selectedCurrency?.symbol}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

interface AddMembersProps {
  onFocus: () => void;
  selectedContacts: ContactData[];
  setSelectedContacts: Dispatch<SetStateAction<ContactData[]>>;
}

interface PhoneNumbers {
  id: string;
  label: string;
  number: string;
}
interface ContactCardProps {
  recordID: string;
  displayName: string;
  phoneNumbers: Array<PhoneNumbers>;
  searchQuery: string;
  onPress?: () => void;
  showEditButton?: boolean;
  mobileNumber: string;
}
interface ContactData {
  recordID: string;
  displayName: string;
  phoneNumbers: Array<PhoneNumbers>;
  mobileNumber: string;
}
const ContactCard: React.FC<ContactCardProps> = ({
  displayName,
  phoneNumbers,
  searchQuery,
  onPress,
  showEditButton = false,
  mobileNumber,
}) => {
  let phoneNumbers_ = phoneNumbers.filter(
    (item) => !item?.number?.includes("-")
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        width: Dimensions.get("screen").width * 0.8,
        marginHorizontal: 16,
        padding: 12,
        borderWidth: 0.5,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        alignSelf: "center",
      }}
    >
      {/* <Text style={{ color: "black", width: "50%" }}>{displayName}</Text> */}
      <HighlightedSubstring text={displayName} highlight={searchQuery} />
      <Text style={{ color: "black", width: "40%", textAlign: "right" }}>
        {mobileNumber}
      </Text>
      <Image
        style={{ height: 20, width: 20 }}
        source={showEditButton ? EDIT : PLUS}
      />
    </TouchableOpacity>
  );
};

function getMobileNumber(arrayOfPh: PhoneNumbers[]): string {
  if (arrayOfPh.length === 0) {
    return "";
  } else {
    for (const element of arrayOfPh) {
      let mobileNumber: string = element.number
        ?.replaceAll("-", "")
        ?.replace("+91", "");

      let isValidInput = /^[6-9][0-9]{9}$/.test(mobileNumber);

      if (isValidInput) {
        console.log("mobileNumber", isValidInput, mobileNumber, new Date());

        return mobileNumber;
      }
    }
    return "";
  }
}
const AddMembers: React.FC<AddMembersProps> = ({
  onFocus,
  selectedContacts,
  setSelectedContacts,
}) => {
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [searchResults, setSearchResults] = useState<ContactData[]>([]);
  // const [selectedContacts, setSelectedContacts] = useState<ContactData[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editMemberData, setEditMemberData] = useState({
    memberName: "",
    mobileNUmber: "",
    recordID: "",
  });
  async function getContacts() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Need Permission for Read Contacts",
          message: "SplitMadi App need permission.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const contacts: ContactCardProps[] =
          await NativeModules.MyContactsModule.getAll();
        console.log("READ_CONTACTS: ", JSON.stringify(contacts[3]));
        let conData: ContactData[] = [];
        for (const element of contacts) {
          let mobile = await getMobileNumber(element.phoneNumbers);

          if (mobile) {
            conData.push({ ...element, mobileNumber: mobile });
          }
        }
        console.log("conData", conData);
        setContacts(conData);
      } else {
        console.log("Contacts permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  function searchContats(searchQuery: string): void {
    console.log("searchContats", searchQuery);

    if (searchQuery === "") {
      setSearchResults([]);
    } else {
      let filteredData: ContactData[] = contacts.filter((item) => {
        return item.displayName
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase());
      });
      setSearchResults(filteredData);
    }
  }
  const debounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;

    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
      const context = this;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const debouncedFetchData = debounce(searchContats, 500);

  useEffect(() => {
    searchContats(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    if (isFocused) {
      onFocus();
    }
  }, [isFocused]);

  const onSaveData = (name: string, mob: string): void => {
    let isPresent = selectedContacts.find(
      (item) => item.recordID === editMemberData.recordID
    );
    let filterdData = [];
    if (isPresent) {
      filterdData = selectedContacts.map((item_) => {
        if (item_.recordID === editMemberData.recordID) {
          return { ...item_, mobileNumber: mob, displayName: name };
        } else {
          return item_;
        }
      });
    } else {
      filterdData = [
        ...selectedContacts,
        {
          mobileNumber: mob,
          displayName: name,
          recordID: name,
          phoneNumbers: [],
        },
      ];
    }

    setSelectedContacts(filterdData);
    setShowEditModal(false);
    // alert(name + " " + mob);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputView}>
        <GenericInput
          value={searchQuery}
          onChangeText={(value) => {
            setSearchQuery(value);
            debouncedFetchData(value);
          }}
          placeholderTextColor={"gray"}
          customMainStyle={styles.customMainStyleInput}
          customInputStyle={styles.customInputStyleInput}
          placeholder="Search Here for contacts"
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setSearchQuery("")}
        >
          <Image
            style={{ height: 25, width: 25, marginRight: 12 }}
            source={CANCEL}
          />
        </TouchableOpacity>
      </View>
      {searchResults?.length > 0 || searchQuery !== "" ? (
        <View style={styles.resultsView}>
          <View style={{ maxHeight: 350, width: "100%", padding: 12 }}>
            <Text style={styles.searchResults}>Search Results</Text>
            {searchResults?.length > 0 ? (
              <FlatList
                contentContainerStyle={{ alignItems: "center" }}
                renderItem={({ item }) => {
                  return (
                    <ContactCard
                      phoneNumbers={item.phoneNumbers}
                      displayName={item.displayName}
                      searchQuery={searchQuery}
                      onPress={() => {
                        setSelectedContacts([...selectedContacts, item]);
                        setSearchQuery("");
                      }}
                      recordID={item.recordID}
                      mobileNumber={item.mobileNumber}
                    />
                  );
                }}
                data={searchResults?.slice(1, 30)}
              />
            ) : (
              <ContactCard
                phoneNumbers={[]}
                displayName={searchQuery}
                searchQuery={searchQuery}
                onPress={() => {
                  setEditMemberData({
                    recordID: searchQuery,
                    memberName: searchQuery,
                    mobileNUmber: "",
                  });
                  setShowEditModal(true);
                  setSearchQuery("");
                }}
                recordID={searchQuery}
                mobileNumber={""}
              />
            )}
          </View>
        </View>
      ) : null}
      {selectedContacts?.length > 0 ? (
        <View style={[styles.resultsView, styles.selectedView]}>
          <View style={{ width: "100%", padding: 12 }}>
            <Text style={styles.searchResults}>Selected Members</Text>
            <FlatList
              contentContainerStyle={{ alignItems: "center" }}
              renderItem={({ item }) => {
                return (
                  <ContactCard
                    phoneNumbers={item.phoneNumbers}
                    mobileNumber={item.mobileNumber}
                    displayName={item.displayName}
                    searchQuery={searchQuery}
                    onPress={() => {
                      setEditMemberData({
                        recordID: item.recordID,
                        memberName: item.displayName,
                        mobileNUmber: item.mobileNumber,
                      });
                      setShowEditModal(true);
                    }}
                    showEditButton={true}
                    recordID={item.recordID}
                  />
                );
              }}
              data={selectedContacts}
            />
          </View>
        </View>
      ) : null}
      {showEditModal ? (
        <EditAddMember
          visible={showEditModal}
          memberName={editMemberData.memberName}
          mobileNUmber={editMemberData.mobileNUmber}
          onRequestClose={() => setShowEditModal(false)}
          onSaveData={onSaveData}
          onDelete={() => {
            let filterdData = selectedContacts.filter(
              (item_) => item_.recordID !== editMemberData.recordID
            );
            setSelectedContacts(filterdData);
            setShowEditModal(false);
          }}
        />
      ) : null}
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function AddGroup({ navigation }: any) {
  console.log("navigation", navigation.route);
  const [currentScreen, setCurrentScreen] = useState<string>("Gruop Details");
  const onFocusScreen = (screenName: string): void => {
    setCurrentScreen(screenName);
  };
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [groupDes, setGroupDes] = useState<string>("");

  const [selectedCurrency, setSelectedCurrency] = useState({
    country: "India",
    currency: "Indian Rupee",
    symbol: "₹",
    flagURL: "https://flagpedia.net/data/flags/normal/in.png",
  });
  const currencyPickerRef = useRef<BottomSheetModal>(null);
  const [selectedContacts, setSelectedContacts] = useState<ContactData[]>([]);
  const groupsRef = firestore().collection("Groups");
  const groupsUsersRef = firestore().collection("GroupUsers");
  function insertIntoGroup() {
    getDataFromAsync(LOGIN_USER_DATA).then(
      async (value: UsersDataInterFace) => {
        const groupId: string = generateGroupId(6);
        let groupData = {
          createdBy: value?.mobileNumber,
          createdOn: getCurrentTime(),
          currency: selectedCurrency?.symbol,
          description: groupDes,
          groupId: groupId,
          groupLogo: "",
          groupName: groupName,
          isOnline: isEnabled,
        };
        try {
          await groupsRef.add(groupData);
          await groupsUsersRef.add({
            balance: "0",
            groupId: groupId,
            mobileNumber: value?.mobileNumber,
            userId: value?.mobileNumber,
            userName: value?.userName,
          });
          for (const element of selectedContacts) {
            let groupUsers: GroupUsersInterFace = {
              balance: "0",
              groupId: groupId,
              mobileNumber: element.mobileNumber,
              userId: element.mobileNumber,
              userName: element.displayName,
            };
            await groupsUsersRef.add(groupUsers);
          }
          console.log("created");
          showToast({
            mainText: "Group Created Successfully",
          });
          navigation.goBack();
        } catch (err) {
          console.log("created err", err);
          showToast({
            mainText: "Something went wrong",
            type: "error",
          });
        }
      }
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        navigation={navigation}
        showBackButton={true}
        title={"Create New Group"}
      />
      <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen
          name="Gruop Details"
          children={() => (
            <GroupDetails
              groupName={groupName}
              setGroupName={setGroupName}
              groupDes={groupDes}
              setGroupDes={setGroupDes}
              setIsEnabled={setIsEnabled}
              isEnabled={isEnabled}
              currencyPickerRef={currencyPickerRef}
              selectedCurrency={selectedCurrency}
              onFocus={() => onFocusScreen("Gruop Details")}
            />
          )}
        />
        <Tab.Screen
          name="Add Members"
          children={() => (
            <AddMembers
              onFocus={() => onFocusScreen("Add Members")}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts}
            />
          )}
        />
      </Tab.Navigator>
      <GenericButton
        customeBtnStyle={styles.btnStyle}
        customTxtStyle={{ textTransform: "uppercase" }}
        title={currentScreen === "Gruop Details" ? "Next" : "Create New Group"}
        isFilled={true}
        onPress={() => {
          // insertIntoGroup();
          if (groupName === "") {
            showToast({ mainText: "Please Enter Group Name", type: "error" });
            if (currentScreen !== "Gruop Details") {
              navigation.navigate("Gruop Details", { name: "Gruop Details" });
            }
            return;
          }
          if (currentScreen === "Gruop Details") {
            navigation.navigate("Add Members", { name: "Add Members" });
            setCurrentScreen("Add Members");
          } else {
            insertIntoGroup();
            // console.log("Group Created");
          }
        }}
      />
      <CurrencyPicker
        selectedCurrency={selectedCurrency}
        currencyPickerRef={currencyPickerRef}
        onSelectedCurrency={(item) => {
          setSelectedCurrency(item);
          currencyPickerRef?.current?.close();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shareView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  shareTxt: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  switchBtn: {
    width: 60,
    height: 50,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  currencyValueView: { flexDirection: "row", alignItems: "center" },
  flagImage: {
    height: 15,
    width: 30,
  },
  curSymbol: {
    color: "#2faff5",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  btnStyle: {
    marginBottom: 16,
    width: "85%",
    alignSelf: "center",
    marginTop: 16,
  },
  searchResults: {
    color: "black",
    // marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputView: {
    borderWidth: 0.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "91%",
    alignSelf: "center",
    borderColor: "#2faff5",
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },
  customMainStyleInput: {
    marginTop: 0,
    width: "80%",
    marginHorizontal: 16,
    padding: 0,
    margin: 0,
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  customInputStyleInput: {
    borderWidth: 0,
    borderColor: "white",
    marginVertical: 0,
    marginTop: 0,
  },
  resultsView: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#2faff5",
    width: "90%",
    backgroundColor: "white",
    zIndex: 2,
  },
  selectedView: {
    flex: 1,
    zIndex: 0,
    borderColor: "green",
    position: "relative",
    top: 0,
    paddingBottom: 30,
  },
});
