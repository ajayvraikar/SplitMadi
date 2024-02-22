import {
  Button,
  FlatList,
  Image,
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { GroupUsersInterFace } from "../redux/types/groups.types";
import UserCard from "../components/UserCard";
import { GroupInterFace } from "../utils/interfaces";

interface Props {
  navigation: {
    navigate?: any;
  };
  groupUsers: GroupUsersInterFace[];
  selectedGroup: GroupInterFace;
}
const HomeScreen: React.FC<Props> = ({ groupUsers, selectedGroup }) => {
  console.log("HomeScreen");

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <FlatList
        data={groupUsers}
        renderItem={({ item }) => {
          return (
            <UserCard
              userName={item.userName || ""}
              balance={item.balance || ""}
              currency={selectedGroup.currency || ""}
            />
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    // backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
