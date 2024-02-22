// src/screens/DetailScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../navigation/StackNavigator";

type DetailScreenRouteProp = RouteProp<StackParamList, "Detail">;
type DetailScreenNavigationProp = StackNavigationProp<StackParamList, "Detail">;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { itemId } = route.params;

  return (
    <View>
      <Text>Detail Screen</Text>
      <Text>Item ID: {itemId}</Text>
    </View>
  );
};

export default DetailScreen;
