import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import GenericCenterModal from "./GenericCenterModal";
import { Image } from "react-native";
import { BILL, CANCEL, PAYMENT, PERSON, PLUS } from "../assets/Images";
import { GroupUsersInterFace } from "../redux/types/groups.types";

interface AddOptionProps {
  optionTitle: string;
  optionDesc: string;
  onPressOpton: () => void;
  image: any;
  bottomHeight: number;
}
const AddOption: React.FC<AddOptionProps> = ({
  bottomHeight,
  image,
  onPressOpton,
  optionTitle,
  optionDesc,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: bottomHeight,
        flexDirection: "row",
        alignItems: "center",
        right: 30,
        // justifyContent: "space-between",
      }}
    >
      <View
        style={{
          marginRight: 20,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.optionTitle}>{optionTitle}</Text>
        <Text style={styles.optionDesc}>{optionDesc}</Text>
      </View>
      <TouchableOpacity
        onPress={onPressOpton}
        activeOpacity={0.7}
        style={[
          styles.fabBtn,
          {
            position: "relative",
            backgroundColor: "white",
            bottom: 0,
            right: 0,
          },
        ]}
      >
        <Image
          source={image}
          style={{ height: 30, width: 30, tintColor: "#2faff5" }}
        />
      </TouchableOpacity>
    </View>
  );
};

interface AddOptionModalProps {
  visible: boolean;
  onRequestClose: () => void;
  navigation: any;
  groupUserData: GroupUsersInterFace[];
}
const AddOptionModal: React.FC<AddOptionModalProps> = ({
  visible,
  onRequestClose,
  groupUserData,
  navigation,
}) => {
  return (
    <GenericCenterModal visible={visible} onRequestClose={onRequestClose}>
      <AddOption
        bottomHeight={110}
        image={BILL}
        optionTitle={"New Bill"}
        optionDesc={"A new bill Made for the group"}
        onPressOpton={() => {
          onRequestClose();
          navigation.navigate("AddBill", { groupUserData });
        }}
      />
      <AddOption
        bottomHeight={190}
        image={PERSON}
        optionTitle={"New Person"}
        optionDesc={"Some body to split bills with."}
        onPressOpton={() => {
          onRequestClose();
          navigation.navigate("AddGroup");
        }}
      />
      <AddOption
        bottomHeight={270}
        image={PAYMENT}
        optionTitle={"New Payment"}
        optionDesc={"A Payment with in the group"}
        onPressOpton={() => {}}
      />

      <TouchableOpacity
        onPress={() => {
          onRequestClose();
          // navigation.navigate("AddGroup");
        }}
        activeOpacity={0.7}
        style={styles.fabBtn}
      >
        <Image
          source={CANCEL}
          style={{ height: 30, width: 30, tintColor: "white" }}
        />
      </TouchableOpacity>
    </GenericCenterModal>
  );
};

export default AddOptionModal;

const styles = StyleSheet.create({
  fabBtn: {
    position: "absolute",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    bottom: 30,
    right: 30,
    backgroundColor: "#2faff5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  optionTitle: {
    color: "#2faff5",
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 4,
  },
  optionDesc: {
    color: "white",
    fontWeight: "400",
    fontSize: 12,
  },
});
