import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface UserCardProps {
  userName: string;
  balance: string;
  currency: string;
}
const UserCard: React.FC<UserCardProps> = ({ userName, balance, currency }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "95%",
        justifyContent: "space-between",
        alignSelf: "center",
        padding: 12,
        borderWidth: 0.5,
        marginBottom: 8,
      }}
    >
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.amount}>
        {currency} {balance}
      </Text>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  userName: {
    color: "gray",
    fontSize: 14,
    fontWeight: "600",
  },
  amount: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
});
