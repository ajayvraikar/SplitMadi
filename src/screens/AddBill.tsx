import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import GenericInput from "../components/GenericInput";
import GenericButton from "../components/GenericButton";
import billCategory from "../constants/categories.json";
import {
  CategoryInterface,
  memberType,
  splitTypeEnam,
} from "../utils/interfaces";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/StackNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { ARROW_UP } from "../assets/Images";
import PaidByPicker from "../components/PaidByPicker";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  SplitUserDataInterFace,
  UsersDataInterFace,
} from "../redux/types/common.types";
import {
  getCurrentTime,
  getOnlyNumbers,
  showToast,
} from "../utils/genericUtils";
import SplitAmountPicker from "../components/SplitAmountPicker";
import firestore from "@react-native-firebase/firestore";
import { getDataFromAsync, LOGIN_USER_DATA } from "../utils/asyncStorageUtils";

type AddBillRouteProp = RouteProp<StackParamList, "AddBill">;
type AddBillNavigationProp = StackNavigationProp<StackParamList, "AddBill">;

type Props = {
  route: AddBillRouteProp;
  navigation: AddBillNavigationProp;
};

const AddBill: React.FC<Props> = ({ navigation, route }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>({
    id: 0,
    name: "General",
    icon: "📊",
  });
  const scrollViewRef = useRef<FlatList>(null);
  const [pos, setPos] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [loginUser, setLoginUser] = useState(null);
  const [selectedType, setSelectedType] = useState<memberType>(
    memberType.singleMembers
  );
  const [splitType, setSplitType] = useState<splitTypeEnam>(
    splitTypeEnam.equally
  );
  const [paidUsers, setPaidUsers] = useState<UsersDataInterFace[]>([]);
  const [paidUser, setPaidUser] = useState<UsersDataInterFace | null>(null);
  const [billFields, setBillFields] = useState({
    billTitle: "",
    billAmount: "",
    billDes: "",
  });

  const [splitUsers, setSplitUsers] = useState<SplitUserDataInterFace[]>(
    route.params.groupUserData.map((item) => {
      return { ...item, isSelected: true };
    })
  );

  const [splitUsersLocal, setSplitUsersLocal] = useState<
    SplitUserDataInterFace[]
  >(
    route.params.groupUserData.map((item) => {
      return { ...item, isSelected: true };
    })
  );

  const reduxData = useSelector((state: RootState) => state.commonData);
  const paidByPickerRef = useRef<BottomSheetModal>(null);
  const splitPickerRef = useRef<BottomSheetModal>(null);

  const expensesRef = firestore().collection("ExpensesItem");
  const [loginUserData, setLoginUserData] = useState<UsersDataInterFace>({});
  useEffect(() => {
    getDataFromAsync(LOGIN_USER_DATA).then((res) => {
      if (res) {
        console.log("LOGIN_USER_DATA", res);
        setLoginUserData(res);
      }
    });
  }, []);
  useEffect(() => {
    if (scrollViewRef?.current && billCategory?.length >= scrollIndex) {
      try {
        if (pos !== 1) {
          setTimeout(() => {
            scrollViewRef?.current?.scrollToIndex({
              animated: true,
              index: scrollIndex,
              viewPosition: 0.3,
            });
          }, 2000);
        } else {
          scrollViewRef?.current?.scrollToIndex({
            animated: true,
            index: scrollIndex,
            viewPosition: 0.3,
          });
        }
      } catch (error) {}
    }
  }, [scrollIndex, billCategory, pos]);

  function renderCategorySection() {
    return (
      <FlatList
        horizontal
        ref={scrollViewRef}
        contentContainerStyle={{ marginHorizontal: 8 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setPos(1);
                setScrollIndex(index);
                setSelectedCategory(item);
              }}
              activeOpacity={0.6}
              style={[
                styles.categoryItem,
                {
                  backgroundColor:
                    selectedCategory.id === item.id ? "#2faff5" : "#F6F6F6",
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryTxt,
                  {
                    color:
                      selectedCategory.id === item.id ? "white" : "#B2B2B2",
                  },
                ]}
              >
                {item.name} {"  "} {item.icon}
              </Text>
            </TouchableOpacity>
          );
        }}
        data={billCategory}
      />
    );
  }
  function getPaidBy(): string {
    let paidBy = "";
    if (paidUser != null) {
      paidBy = paidUser.userName || "";
    } else if (paidUsers.length > 0) {
      paidBy = paidUsers.length > 1 ? "Multiple" : paidUsers[0].userName || "";
    }
    return paidBy;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header navigation={navigation} title={"Add Bill"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 12 }}
      >
        <Text style={[styles.labelTxt]}>Choose Category</Text>
        {renderCategorySection()}
        <GenericInput
          value={billFields.billTitle}
          onChangeText={(value) =>
            setBillFields({ ...billFields, billTitle: value })
          }
          title="Bill Title"
          placeholder="Please Enter Bill Title here.."
          customInputStyle={styles.inputStyle}
          placeholderTextColor={"#D3D3D3"}
          customTextStyle={styles.headingTxt}
        />
        <GenericInput
          title="Bill Amount"
          value={billFields.billAmount}
          onChangeText={(value) =>
            setBillFields({
              ...billFields,
              billAmount: getOnlyNumbers(value),
            })
          }
          placeholder="Please Enter Bill Amount here.."
          placeholderTextColor={"#D3D3D3"}
          customInputStyle={styles.inputStyle}
          customTextStyle={styles.headingTxt}
          // customMainStyle={{ width: "48%" }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={[styles.labelTxt, { marginBottom: 0, marginTop: 12 }]}>
              Paid By
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (billFields.billAmount === "") {
                  showToast({
                    mainText: "Please Enter Bill amount",
                    type: "error",
                  });
                  return;
                }
                paidByPickerRef?.current?.present();
              }}
              style={styles.paidByPicker}
            >
              <Text
                style={{
                  color: getPaidBy() ? "black" : "#D3D3D3",
                  fontSize: 14,
                  marginRight: 20,
                }}
              >
                {getPaidBy() || "Select Paid member"}
              </Text>
              <Image style={styles.arrowUpImage} source={ARROW_UP} />
            </TouchableOpacity>
          </View>
          <View style={{ width: "48%" }}>
            <Text style={[styles.labelTxt, { marginBottom: 0, marginTop: 12 }]}>
              Split
            </Text>
            <TouchableOpacity
              onPress={() => {
                splitPickerRef?.current?.present();
              }}
              style={styles.paidByPicker}
            >
              <Text
                style={{
                  color: getPaidBy() ? "black" : "#D3D3D3",
                  fontSize: 14,
                  marginRight: 20,
                }}
              >
                {splitType}
              </Text>
              <Image style={styles.arrowUpImage} source={ARROW_UP} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <GenericButton
        title="Save Bill"
        onPress={() => {
          let ExpensesData = {
            expenseId: new Date().valueOf(),
            addedOn: getCurrentTime(),
            paidForPersons: "we",
            paidDate: getCurrentTime(),
            expenseTitle: billFields.billTitle,
            expenseType: selectedCategory.name,
            addedBy: loginUserData?.userId,
            expenseDesc: billFields.billDes,
            paidByPersons: "w",
            expenseAmount: billFields.billAmount,
          };
          console.log(
            "Save Bill",
            paidUsers,
            splitUsers,
            splitType,
            selectedType,
            paidUser,
            ExpensesData,
            loginUserData
          );
          let Expenses = {
            addedOn: "w",
            paidForPersons: "we",
            expenseId: "1234",
            paidDate: "we",
            expenseTitle: "sff",
            expenseType: "sample",
            addedBy: "we",
            expenseDesc: "sd",
            paidByPersons: "w",
          };
          let ExpensesItem = {
            splitType: "hfghbj",
            expensesItemId: "wr",
            expenseId: "3433",
            paidFor: "4253",
            paidBy: "987689",
            isFor: false,
            expenseAmount: "",
            paidType: "ghjhvj",
            isBy: true,
          };
        }}
        customeBtnStyle={{ alignSelf: "center", marginVertical: 16 }}
        customTxtStyle={{ textTransform: "uppercase" }}
      />
      <SplitAmountPicker
        splitUsers={splitUsersLocal}
        bottomSheetModalRef={splitPickerRef}
        setSplitUsers={setSplitUsersLocal}
        billAmount={billFields.billAmount}
        onSaveData={(splitBy_: splitTypeEnam) => {
          setSplitType(splitBy_);
          setSplitUsers(splitUsersLocal);
          splitPickerRef?.current?.close();
        }}
      />
      <PaidByPicker
        usersData={route.params.groupUserData}
        bottomSheetModalRef={paidByPickerRef}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onPressPaidUser={(data: UsersDataInterFace) => {
          if (selectedType === memberType.singleMembers) {
            setPaidUser(data);
            paidByPickerRef.current?.close();
            setPaidUsers([]);
          } else {
            if (paidUsers.includes(data)) {
              let filterData = paidUsers.filter(
                (item) => item.userId !== data.userId
              );
              setPaidUsers(filterData);
            } else {
              setPaidUsers([...paidUsers, data]);
            }
            setPaidUser(null);
          }
        }}
        paidUsers={paidUsers}
        setPaidUsers={setPaidUsers}
        paidUser={paidUser || null}
        totalPeople={route.params.groupUserData?.length}
        billAmount={billFields.billAmount}
      />
    </View>
  );
};

export default AddBill;

const styles = StyleSheet.create({
  labelTxt: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 16,
    marginVertical: 8,
    color: "gray",
  },
  paidByPicker: {
    padding: 16,
    paddingLeft: 0,
    borderBottomWidth: 0.8,
    borderColor: "gray",
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  splitUser: {
    width: 90,
    borderWidth: 3,
    borderColor: "#2faff5",
    height: 65,
    marginRight: 16,
    borderRadius: 12,
  },
  userNameV: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2faff5",
    borderTopEndRadius: 8,
    borderTopLeftRadius: 8,
  },
  categoryTxt: {
    color: "#B2B2B2",
    fontSize: 14,
    fontWeight: "600",
  },
  arrowUpImage: {
    height: 20,
    width: 20,
    tintColor: "gray",
    transform: [{ rotate: "180deg" }],
  },
  inputStyle: {
    borderTopColor: "white",
    borderRightColor: "white",
    borderLeftColor: "white",
    borderRadius: 0,
    paddingLeft: 0,
    width: "100%",
  },
  headingTxt: {
    color: "gray",
    marginBottom: 4,
    marginTop: 12,
  },
  categoryItem: {
    paddingHorizontal: 12,
    borderWidth: 0.3,
    borderRadius: 12,
    paddingVertical: 8,
    margin: 8,
    marginBottom: 16,
    borderColor: "#2faff5",
  },
  topView: {
    flexDirection: "row",
    marginTop: 16,
    width: "90%",
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
  },
});
