import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
interface OwnProps {
  title?: string;
  customMainStyle?: ViewStyle;
  customTextStyle?: StyleProp<TextStyle>;
  customInputStyle?: ViewStyle;
}
export type CustomInputProps = TextInputProps & OwnProps;

const GenericInput: React.FC<CustomInputProps> = ({
  title,
  customMainStyle,
  customTextStyle,
  customInputStyle,
  placeholderTextColor = "gray",
  ...restProps
}) => {
  return (
    <View style={[styles.mainView, customMainStyle]}>
      {title ? (
        <Text style={[styles.titleStyle, customTextStyle]}>{title}</Text>
      ) : null}
      <TextInput
        style={[styles.inputStyle, customInputStyle]}
        placeholderTextColor={placeholderTextColor}
        {...restProps}
      />
    </View>
  );
};

export default GenericInput;

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 16,
    marginBottom: 12,
    width: "100%",
  },
  titleStyle: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputStyle: {
    borderWidth: 0.6,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});
