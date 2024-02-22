import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import GenericModal from "./GenericModal";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import GenericButton from "./GenericButton";
import { UsersDataInterFace } from "../redux/types/common.types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { RIGHT_MARK, UNCHECKED } from "../assets/Images";
import { memberType } from "../utils/interfaces";
import TopOption from "./TopOption";
import { getOnlyNumbers, showToast } from "../utils/genericUtils";

interface PaidByPickerProps {
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  usersData?: UsersDataInterFace[];
  selectedType: memberType;
  setSelectedType: Dispatch<SetStateAction<memberType>>;
  onPressPaidUser: (data: UsersDataInterFace) => void;
  paidUsers: UsersDataInterFace[];
  paidUser: UsersDataInterFace | null;
  totalPeople: number;
  billAmount: string;
  setPaidUsers: Dispatch<SetStateAction<UsersDataInterFace[]>>;
}
const PaidByPicker: React.FC<PaidByPickerProps> = ({
  bottomSheetModalRef,
  usersData,
  selectedType,
  setSelectedType,
  onPressPaidUser,
  paidUsers,
  paidUser,
  totalPeople,
  billAmount,
  setPaidUsers,
}) => {
  const loginUserData = useSelector((state: RootState) => state.commonData);
  const selectedGroup = useSelector((state: RootState) => state.selectedGroup);
  const [remainingAmt, setRemainingAmt] = useState<any>("");
  function getRemainingAmount(paidUsers_: UsersDataInterFace[]) {
    let enteredAmt = 0;
    paidUsers_.forEach((elememt) => {
      console.log("paidUserspaidUsers amau", elememt?.amount);
      enteredAmt = parseFloat(`${elememt?.amount || 0}`) + enteredAmt;
    });
    console.log("paidUserspaidUsers", enteredAmt);
    return parseFloat(billAmount) - (enteredAmt || 0);
  }
  useEffect(() => {
    setRemainingAmt(getRemainingAmount(paidUsers));
  }, [paidUsers]);

  return (
    <GenericModal
      snapPointsArray={[]}
      bottomSheetModalRef={bottomSheetModalRef}
    >
      <BottomSheetView style={{ maxHeight: 600 }}>
        <View style={styles.topView}>
          <TopOption
            onPress={() => {
              setSelectedType(memberType.singleMembers);
            }}
            isSelected={selectedType === memberType.singleMembers}
            title={memberType.singleMembers}
          />
          <TopOption
            onPress={() => {
              setSelectedType(memberType.multipleMembers);
            }}
            isSelected={selectedType === memberType.multipleMembers}
            title={memberType.multipleMembers}
          />
        </View>
        <View style={styles.middleView}>
          <Text style={styles.payerName}>Payer`s Name</Text>
          {selectedType === memberType.multipleMembers ? (
            <Text style={styles.payerName}>Enter Share</Text>
          ) : null}
        </View>
        <View>
          {usersData?.map((item, index) => {
            let currentUser = paidUsers?.find(
              (item_) => item.userId === item_.userId
            );
            const isSelected =
              selectedType === memberType.multipleMembers
                ? currentUser
                : paidUser?.userId === item.userId;
            const borderColor = isSelected ? "#2faff5" : "gray";

            return (
              <TouchableOpacity
                activeOpacity={0.6}
                key={index}
                style={[styles.payerCardView, { borderColor }]}
                onPress={() => {
                  onPressPaidUser(item);
                }}
              >
                {selectedType === memberType.multipleMembers ? (
                  <View
                    style={{
                      height: 23,
                      width: 23,
                      borderWidth: isSelected ? 0 : 1,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      borderRadius: 4,
                      borderColor: "gray",
                      backgroundColor: isSelected ? "#2faff5" : "white",
                    }}
                  >
                    {isSelected ? (
                      <Image
                        style={styles.multiIcon}
                        resizeMode={"stretch"}
                        source={RIGHT_MARK}
                      />
                    ) : null}
                  </View>
                ) : (
                  <View style={[styles.circleFirst, { borderColor }]}>
                    {isSelected ? <View style={styles.circleMiddle} /> : null}
                  </View>
                )}

                <Text style={{ flex: 1, color: "black", fontSize: 14 }}>
                  {item.userName}{" "}
                  {item.userId === loginUserData?.userId ? " (You)" : ""}
                </Text>
                {selectedType === memberType.multipleMembers && isSelected ? (
                  <View style={styles.amountView}>
                    <Text>{selectedGroup.currency} </Text>
                    <BottomSheetTextInput
                      keyboardType="number-pad"
                      onChangeText={(value) => {
                        let changedData: UsersDataInterFace[] =
                          paidUsers.map((item_) => {
                            if (item.userId === item_.userId) {
                              return {
                                ...item_,
                                amount: parseFloat(getOnlyNumbers(value)),
                              };
                            }
                            return item_;
                          }) || [];
                        console.log("changedData", changedData);
                        setPaidUsers(changedData);
                      }}
                      style={styles.inputTxt}
                      placeholder="0"
                      value={`${currentUser?.amount || ""}`}
                    />
                  </View>
                ) : (
                  <View style={{ height: 36 }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedType === memberType.multipleMembers ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 16,
              height: 30,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "black",
                fontWeight: "400",
              }}
            >
              People : {paidUsers.length} / {totalPeople}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "black",
                fontWeight: "400",
              }}
            >
              Remeaning :{" "}
              <Text
                style={{
                  color: parseInt(remainingAmt) === 0 ? "green" : "red",
                }}
              >
                {remainingAmt}{" "}
              </Text>{" "}
              / {billAmount}
            </Text>
          </View>
        ) : (
          <View style={{ height: 30, width: "100%" }} />
        )}

        <View style={styles.bottomBtnView}>
          <GenericButton
            onPress={() => {
              bottomSheetModalRef?.current?.close();
            }}
            isFilled={false}
            customTxtStyle={{ color: "red" }}
            customeBtnStyle={{
              width: "45%",
              marginTop: 0,
              borderColor: "red",
              paddingVertical: 11,
            }}
            title="CLOSE"
          />
          <GenericButton
            onPress={() => {
              if (parseInt(remainingAmt) !== 0) {
                showToast({
                  mainText: `Amount is not maching ${selectedGroup.currency} ${billAmount}`,
                  type: "error",
                  bottomOffset: 450,
                });
              } else {
                bottomSheetModalRef?.current?.close();
              }
              //
            }}
            customeBtnStyle={{ width: "45%", marginTop: 0 }}
            title="SUBMIT"
          />
        </View>
      </BottomSheetView>
    </GenericModal>
  );
};

export default PaidByPicker;

const styles = StyleSheet.create({
  bottomBtnView: {
    // position: "absolute",
    width: "100%",
    // bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    // paddingBottom: 16,
    // backgroundColor: "red",
  },
  payerName: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
  circleFirst: {
    height: 23,
    width: 23,
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#2faff5",
  },
  multiIcon: {
    height: 18,
    width: 18,
    tintColor: "white",
    resizeMode: "stretch",
  },
  checkBox: {
    height: 23,
    width: 23,
    resizeMode: "stretch",
    marginRight: 12,
    tintColor: "gray",
    // backgroundColor: "red",
  },
  circleMiddle: {
    height: 10,
    width: 10,
    borderRadius: 8,
    backgroundColor: "#2faff5",
  },
  payerCardView: {
    padding: 8,
    paddingHorizontal: 12,
    borderWidth: 0.8,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2faff5",
  },
  topView: {
    flexDirection: "row",
    marginTop: 16,
    width: "90%",
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    // height: 300,
  },
  middleView: {
    marginHorizontal: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputTxt: {
    padding: 0,
    margin: 0,
    marginBottom: 0,
    height: 35,
    marginTop: 0,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    color: "black",
    fontSize: 14,
  },
  amountView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: "gray",
    paddingLeft: 4,
    borderRadius: 8,
  },
});
