import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GenericCenterModal from "./GenericCenterModal";
import { CROSS } from "../assets/Images";
import GenericInput from "./GenericInput";
import GenericButton from "./GenericButton";
import { getOnlyNumbers } from "../utils/genericUtils";

interface EditAddMemberProps {
  onRequestClose?: () => void;
  visible?: boolean;
  memberName?: string;
  mobileNUmber?: string;
  onSaveData: (name: string, mob: string) => void;
  onDelete?: () => void;
}
const EditAddMember: React.FC<EditAddMemberProps> = ({
  visible,
  onRequestClose,
  memberName = "",
  mobileNUmber = "",
  onSaveData,
  onDelete,
}) => {
  const [memberData, setMemberData] = useState({
    memberName: "",
    mobileNUmber: "",
  });
  const [memberDataError, setMemberDataError] = useState({
    memberName: "",
    mobileNUmber: "",
  });
  useEffect(() => {
    setMemberData({
      memberName: memberName,
      mobileNUmber: mobileNUmber,
    });
  }, [visible]);

  function validFields(onlyMobile = false) {
    let isValid = true;
    let mobileError = "";
    let userNameErr = "";

    if (memberData.mobileNUmber === "") {
      isValid = false;
      mobileError = "Please enter valid mobile no";
    }
    if (memberData.memberName === "") {
      isValid = false;
      userNameErr = "Please enter valid username";
    }
    const isValidInput = /^[6-9][0-9]{9}$/.test(memberData.mobileNUmber);
    if (!isValidInput) {
      isValid = false;
      mobileError = "Enter valid 10 digit Mobile no";
    }
    setMemberDataError({
      mobileNUmber: mobileError,
      memberName: !onlyMobile ? userNameErr : memberDataError.memberName,
    });
    return isValid;
  }

  useEffect(() => {
    if (memberData.mobileNUmber) {
      validFields(true);
    }
  }, [memberData.mobileNUmber]);
  return (
    <GenericCenterModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.mainView}>
        <View style={styles.topView}>
          <Text style={styles.title}>Edit Member</Text>
          <TouchableOpacity onPress={onRequestClose} style={styles.crossBtn}>
            <Image style={{ height: 30, width: 30 }} source={CROSS} />
          </TouchableOpacity>
        </View>
        <GenericInput
          value={memberData.memberName}
          onChangeText={(value) => {
            setMemberData({ ...memberData, memberName: value });
          }}
          title="Member Name"
          placeholder="Enter Member Name"
        />
        {memberDataError.memberName && memberData.memberName === "" && (
          <Text style={styles.errorMsg}>{memberDataError.memberName}</Text>
        )}
        <GenericInput
          keyboardType="numeric"
          value={memberData.mobileNUmber}
          onChangeText={(value) => {
            setMemberData({
              ...memberData,
              mobileNUmber: getOnlyNumbers(value),
            });
          }}
          title="Mobile Number"
          placeholder="Enter Mobile Number"
        />
        {memberDataError.mobileNUmber && (
          <Text style={styles.errorMsg}>{memberDataError.mobileNUmber}</Text>
        )}
        {memberName && mobileNUmber ? (
          <GenericButton
            onPress={onDelete}
            title="Delete"
            customeBtnStyle={styles.btnTxtDelete}
            isFilled={false}
            customTxtStyle={{ color: "red" }}
          />
        ) : null}

        <GenericButton
          onPress={() => {
            if (validFields()) {
              onSaveData(memberData.memberName, memberData.mobileNUmber);
            }
          }}
          title="Save Member"
          customeBtnStyle={styles.btnTxt}
          isFilled={true}
        />
      </View>
    </GenericCenterModal>
  );
};

export default EditAddMember;

const styles = StyleSheet.create({
  title: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  mainView: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    padding: 16,
    borderRadius: 12,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  crossBtn: {
    height: 30,
    width: 30,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  btnTxt: {
    marginLeft: 0,
    alignSelf: "center",
    width: "95%",
    marginTop: 16,
    marginHorizontal: 0,
  },
  btnTxtDelete: {
    marginLeft: 0,
    alignSelf: "center",
    width: "95%",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 0,
    borderColor: "red",
  },
  errorMsg: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 16,
    width: "90%",
    marginHorizontal: 16,
  },
});
