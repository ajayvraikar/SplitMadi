import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BACK_ARROW } from "../assets/Images";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  navigation: any;
}

const Header: React.FC<HeaderProps> = ({ title, navigation }) => {
  return (
    <View style={styles.mainStyle}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={{ tintColor: "white", marginRight: 16, height: 30, width: 30 }}
          source={BACK_ARROW}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          //   lineHeight: 20,
          color: "white",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainStyle: {
    padding: 16,
    backgroundColor: "#2faff5",
    flexDirection: "row",
    alignItems: "center",
  },
});
