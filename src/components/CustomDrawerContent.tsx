// src/components/CustomDrawerContent.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { APP_LOGO } from "../assets/Images";
import {
  getDataFromAsync,
  LOGIN_USER_DATA,
  SELECTED_GROUP,
  storeIntoAsync,
} from "../utils/asyncStorageUtils";
import { UsersDataInterFace } from "../utils/interfaces";
import firestore from "@react-native-firebase/firestore";
import { useDrawerStatus } from "@react-navigation/drawer";
import { GroupInterFace } from "../redux/types/groups.types";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedGroup } from "../redux/actions";
type CustomDrawerContentProps = {
  navigation: any; // You can add the specific navigation prop type here
};

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({
  navigation,
  ...props
}) => {
  const disptch = useDispatch();

  const groupsRef = firestore().collection("Groups");
  const groupsUsersRef = firestore().collection("GroupUsers");
  const [loginUserData, setLoginUserData] = useState<UsersDataInterFace>({});
  const [groups, setGroups] = useState<GroupInterFace[]>([]);
  const isFocused = useDrawerStatus();
  const [selectedGroup, setSelectedGroup] = useState<GroupInterFace>({});

  function fetchGroups() {
    getDataFromAsync(LOGIN_USER_DATA).then(async (value) => {
      let groupsUsersRefData = await groupsUsersRef
        .where("userId", "==", value.userId)
        .get();

      let groupIdArray =
        groupsUsersRefData?.docs?.map((item) => item.data()?.groupId) || [];

      let groupsRefData =
        groupIdArray?.length > 0
          ? await groupsRef
              .where(
                "groupId",
                "in",
                groupsUsersRefData?.docs.map((item) => item.data()?.groupId) ||
                  []
              )
              .get()
          : { docs: [] };

      let groups_: GroupInterFace[] = [];
      // console.log("groupsUsersRefData", groupsRefData);
      console.log("groupsRefData", value);
      groupsRefData?.docs?.forEach((item) => {
        const {
          createdBy,
          createdOn,
          currency,
          description,
          groupId,
          groupLogo,
          groupName,
          isOnline,
        } = item.data();
        let groupItem: GroupInterFace = {
          createdBy,
          createdOn,
          currency,
          description,
          groupId,
          groupLogo,
          groupName,
          isOnline,
        };
        groups_.push(groupItem);
      });
      setGroups(groups_);
      setLoginUserData(value);
      getDataFromAsync(SELECTED_GROUP).then((res) => {
        if (res !== null) {
          disptch(updateSelectedGroup(JSON.parse(res)));
        }
      });
    });
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (isFocused === "open") {
      fetchGroups();
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2faff5",
          flexDirection: "row",
          paddingVertical: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            marginRight: 12,
          }}
        >
          <Image style={{ height: 30, width: 30 }} source={APP_LOGO} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Split Madi
        </Text>
      </View>
      <Text style={styles.screenTitle}>Hi {loginUserData?.userName}</Text>
      {groups?.length > 0 ? (
        <Text style={styles.groupHeading}>Your Groups :-</Text>
      ) : null}
      {groups?.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              disptch(updateSelectedGroup(item));
              storeIntoAsync(SELECTED_GROUP, JSON.stringify(item));
              setSelectedGroup(item);
              navigation.closeDrawer();
            }}
            key={index}
            style={{
              marginHorizontal: 12,
              padding: 12,
              borderWidth: 0.5,
              marginBottom: 8,
              borderColor:
                selectedGroup.groupId === item.groupId ? "#2faff5" : "black",
            }}
          >
            <Text
              style={[
                styles.groupName,
                {
                  color:
                    selectedGroup.groupId === item.groupId
                      ? "#2faff5"
                      : "black",
                },
              ]}
            >
              {item.groupName}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={{ position: "absolute", bottom: 18, padding: 16 }}
        onPress={() => {
          AsyncStorage.removeItem(LOGIN_USER_DATA);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "LoginScreen",
                },
              ],
            })
          );
        }}
      >
        <Text style={{ fontSize: 16, margin: 10, marginLeft: 0 }}>LOGOUT</Text>
      </TouchableOpacity>
      <Text style={{ position: "absolute", bottom: 0, padding: 16 }}>
        App Version : 1.1.0
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    color: "#2faff5",
    fontWeight: "700",
    margin: 12,
    // marginTop: 16,
    // marginBottom: 40,
  },
  groupHeading: {
    fontSize: 16,
    color: "black",
    fontWeight: "700",
    margin: 12,
  },
  groupName: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});

export default CustomDrawerContent;
