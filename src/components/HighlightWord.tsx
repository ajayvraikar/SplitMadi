import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface HighlightedSubstringProps {
  text: string;
  highlight: string;
}
const HighlightedSubstring: React.FC<HighlightedSubstringProps> = ({
  text = "",
  highlight,
}) => {
  const parts = text.split(new RegExp(`(${highlight})`, "i"));

  return (
    <View style={styles.container}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? styles.highlightedText
              : styles.normalText
          }
        >
          {part}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "45%",
    flexWrap: "wrap",
  },
  normalText: {
    fontSize: 14,
    color: "black",
    fontWeight: "400",
  },
  highlightedText: {
    fontSize: 14,
    color: "#2faff5",
    fontWeight: "600",
  },
});

export default HighlightedSubstring;
