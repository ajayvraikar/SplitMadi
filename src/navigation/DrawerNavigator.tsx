// src/navigation/DrawerNavigator.tsx
import React, { useEffect } from "react";
import { Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./BottomTabNavigator";
import StackNavigator from "./StackNavigator";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { APP_LOGO } from "../assets/Images";
import { capitalizeFLetter } from "../utils/genericUtils";

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  const data = useSelector((state: RootState) => state.selectedGroup);

  return (
    <Drawer.Navigator
      screenOptions={{
        title: capitalizeFLetter(data?.groupName) || "Home",
        headerStyle: {
          backgroundColor: "#2faff5",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          color: "white",
        },
        headerTitleAlign: "center",
        drawerIcon: ({ size }) => {
          return (
            <Image style={{ height: size, width: size }} source={APP_LOGO} />
          );
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
