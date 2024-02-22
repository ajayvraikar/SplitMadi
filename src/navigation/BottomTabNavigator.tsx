// src/navigation/BottomTabNavigator.tsx
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import SettingsScreen from "../screens/SettingsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PLUS } from "../assets/Images";
import AddOptionModal from "../components/AddOptionModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import firestore from "@react-native-firebase/firestore";
import { GroupUsersInterFace } from "../redux/types/groups.types";

const Tab = createMaterialTopTabNavigator();
interface Props {
  navigation: any;
}
const BottomTabNavigator: React.FC<Props> = (props) => {
  const [addOptionVisible, setAddOptionVisible] = useState<boolean>(false);
  const selectedGroup = useSelector((state: RootState) => state.selectedGroup);
  const groupsUsersRef = firestore().collection("GroupUsers");
  const [groupUsers, setGroupUsers] = useState<GroupUsersInterFace[]>([]);
  async function fetchGroupUsers() {
    if (selectedGroup?.groupId) {
      let groupUserQuery = await groupsUsersRef
        .where("groupId", "==", selectedGroup.groupId)
        .get();
      let groupUserData: GroupUsersInterFace[] = [];
      groupUserQuery.docs.forEach((item) => {
        const { balance, groupId, mobileNumber, userId, userName } =
          item.data();
        groupUserData.push({
          balance,
          groupId,
          mobileNumber,
          userId,
          userName,
        });
      });
      console.log("groupUserData", groupUserData);
      setGroupUsers(groupUserData);
    }
  }
  useEffect(() => {
    fetchGroupUsers();
  }, [selectedGroup]);
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          options={{ title: "Overview" }}
          name="HOMES"
          children={() => {
            return (
              <HomeScreen
                selectedGroup={selectedGroup}
                groupUsers={groupUsers}
                navigation={props.navigation}
              />
            );
          }}
        />
        <Tab.Screen
          options={{ title: "Bills" }}
          name="Profile"
          component={ProfileScreen}
        />
        <Tab.Screen
          options={{ title: "Analytics" }}
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => {
          setAddOptionVisible(!addOptionVisible);
          // props.navigation.navigate("AddGroup")
        }}
        activeOpacity={0.7}
        style={styles.fabBtn}
      >
        <Image
          source={PLUS}
          style={{ height: 30, width: 30, tintColor: "white" }}
        />
      </TouchableOpacity>
      {addOptionVisible ? (
        <AddOptionModal
          groupUserData={groupUsers}
          navigation={props.navigation}
          visible={addOptionVisible}
          onRequestClose={() => setAddOptionVisible(!addOptionVisible)}
        />
      ) : null}
    </View>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  fabBtn: {
    position: "absolute",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    bottom: 30,
    right: 30,
    backgroundColor: "#2faff5",
    zIndex: 100000,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
});
