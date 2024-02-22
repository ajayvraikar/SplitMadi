// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import DrawerNavigator from "./DrawerNavigator";
import SettingScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SplashScreen from "../screens/SplashScreen";
import AddGroup from "../screens/AddGroup";
import AddBill from "../screens/AddBill";
import { GroupUsersInterFace } from "../redux/types/groups.types";

export type StackParamList = {
  Setting: undefined;
  DrawerNavigator: undefined;
  Detail: { itemId: number };
  LoginScreen: undefined;
  SignUp: undefined;
  SplashScreen: undefined;
  AddGroup: undefined;
  AddBill: { groupUserData: GroupUsersInterFace[] };
};

const Stack = createStackNavigator<StackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AddGroup" component={AddGroup} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="AddBill" component={AddBill} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
