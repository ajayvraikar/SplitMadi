import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

interface CustomeProps {
  title: string;
  customeBtnStyle?: ViewStyle;
  customTxtStyle?: TextStyle;
  isFilled?: boolean;
  activeOpacity?: number;
}
export type GenericButtonProps = TouchableOpacityProps & CustomeProps;
const GenericButton: React.FC<GenericButtonProps> = ({
  title,
  customeBtnStyle,
  customTxtStyle,
  isFilled = true,
  activeOpacity = 0.6,
  ...restProps
}) => {
  let buttonStyle: ViewStyle = isFilled
    ? { ...styles.buttonStyle }
    : {
        ...styles.buttonStyle,
        backgroundColor: "white",
        borderWidth: 0.6,
        borderColor: "#2faff5",
      };
  let textStyle: TextStyle = isFilled
    ? { ...styles.textStyle }
    : {
        ...styles.textStyle,
        color: "#2faff5",
      };
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[buttonStyle, customeBtnStyle]}
      {...restProps}
    >
      <Text style={[textStyle, customTxtStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default GenericButton;

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 12,
    backgroundColor: "#2faff5",
    width: "85%",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 40,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  textStyle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
