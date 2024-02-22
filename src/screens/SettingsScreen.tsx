import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

interface Props {
  navigation: any;
}

interface TodoData {
  id: string;
  title: string;
  complete: string;
}
const SettingScreen: React.FC<Props> = (props) => {
  const ref = firestore().collection("Users");
  useEffect(() => {
    return ref.onSnapshot((querySnapshot) => {
      // let list:TodoData = [];
      querySnapshot?.forEach((doc) => {
        const { title, complete } = doc.data();
        console.log("title", doc.data());
      });
    });
  }, []);

  return (
    <TouchableOpacity
      onPress={async () => {
        // props.navigation.navigate("Home");
        // await ref.add({
        //   title: "Ajay Ajay",
        //   complete: false,
        // });
      }}
    >
      <Text>SettingScreen</Text>
    </TouchableOpacity>
  );
};

export default SettingScreen;
