import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";

interface TopOptionProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
  customStyle?: ViewStyle;
}

const TopOption: React.FC<TopOptionProps> = ({
  isSelected,
  onPress,
  title,
  customStyle = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        width: "50%",
        alignItems: "center",
        padding: 10,
        borderRadius: 30,
        backgroundColor: isSelected ? "#2faff5" : "#F5F5F5",
        ...customStyle,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: isSelected ? "white" : "gray",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TopOption;

const styles = StyleSheet.create({});
