import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import TopOption from "./TopOption";
import { splitBy, splitTypeEnam } from "../utils/interfaces";
import { SplitUserDataInterFace } from "../redux/types/common.types";
import GenericButton from "./GenericButton";
import { RIGHT_MARK, UNCHECKED } from "../assets/Images";
import { RootState } from "../redux/reducers";
import { useSelector } from "react-redux";
import { getOnlyNumbers, showToast } from "../utils/genericUtils";

interface SplitAmountPickerProps {
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  splitUsers: SplitUserDataInterFace[];
  setSplitUsers: Dispatch<SetStateAction<SplitUserDataInterFace[]>>;
  onSaveData: (str: splitTypeEnam) => void;
  billAmount: string;
}
const SplitAmountPicker: React.FC<SplitAmountPickerProps> = ({
  bottomSheetModalRef,
  splitUsers,
  setSplitUsers,
  billAmount,
  onSaveData,
}) => {
  const [selectedSplitBy, setSelectedSplitBy] = useState<splitTypeEnam>(
    splitTypeEnam.equally
  );
  const selectedGroup = useSelector((state: RootState) => state.selectedGroup);
  const [remainingAmt, setRemainingAmt] = useState<any>("");
  function getRemainingAmount(paidUsers_: SplitUserDataInterFace[]) {
    let enteredAmt = 0;
    paidUsers_.forEach((elememt) => {
      console.log("paidUserspaidUsers amau", elememt?.amount);
      enteredAmt = parseFloat(`${elememt?.amount || 0}`) + enteredAmt;
    });
    console.log("paidUserspaidUsers", enteredAmt);
    return parseFloat(billAmount) - (enteredAmt || 0);
  }
  useEffect(() => {
    setRemainingAmt(getRemainingAmount(splitUsers));
  }, [splitUsers]);
  return (
    <GenericModal
      snapPointsArray={[]}
      bottomSheetModalRef={bottomSheetModalRef}
    >
      <BottomSheetView
        style={{ height: Dimensions.get("screen").height * 0.7 }}
      >
        <View style={styles.topView}>
          <TopOption
            onPress={() => {
              setSelectedSplitBy(splitTypeEnam.equally);
            }}
            isSelected={selectedSplitBy === splitTypeEnam.equally}
            title={splitBy.equally}
          />
          <TopOption
            onPress={() => {
              setSelectedSplitBy(splitTypeEnam.unEqually);
            }}
            isSelected={selectedSplitBy === splitTypeEnam.unEqually}
            title={splitBy.unEqually}
          />
        </View>
        <View style={styles.middleView}>
          <Text style={styles.payerName}>Split Amoung</Text>
          {/* <Text style={styles.payerName}>
            Enter {selectedSplitBy === splitBy.byShare ? "Share" : "Amount"}
          </Text> */}
        </View>
        {splitUsers.map((res) => {
          return (
            <TouchableOpacity
              disabled={selectedSplitBy === splitTypeEnam.unEqually}
              onPress={() => {
                let filterData = splitUsers.map((item) => {
                  if (item?.mobileNumber === res?.mobileNumber) {
                    return { ...item, isSelected: !item?.isSelected };
                  }
                  return item;
                });
                setSplitUsers(filterData);
              }}
              style={styles.userBtn}
            >
              {selectedSplitBy === splitTypeEnam.equally ? (
                <View
                  style={{
                    ...styles.innerView,
                    borderWidth: res.isSelected ? 0 : 1,
                    backgroundColor: res.isSelected ? "#2faff5" : "white",
                  }}
                >
                  {res.isSelected ? (
                    <Image
                      style={styles.multiIcon}
                      resizeMode={"stretch"}
                      source={RIGHT_MARK}
                    />
                  ) : null}
                </View>
              ) : null}

              <Text style={{ flex: 1 }}>{res.userName}</Text>
              {selectedSplitBy !== splitTypeEnam.equally ? (
                <View style={styles.amountView}>
                  <Text style={{ marginHorizontal: 4 }}>
                    {selectedGroup.currency}{" "}
                  </Text>

                  <BottomSheetTextInput
                    keyboardType="number-pad"
                    onChangeText={(value) => {
                      let changedData: SplitUserDataInterFace[] =
                        splitUsers.map((item_) => {
                          if (res.userId === item_.userId) {
                            return {
                              ...item_,
                              amount: parseFloat(getOnlyNumbers(value)),
                            };
                          }
                          return item_;
                        }) || [];
                      console.log("changedData", changedData);
                      setSplitUsers(changedData);
                    }}
                    style={styles.inputTxt}
                    placeholder="0"
                    value={`${res.amount || ""}`}
                  />
                </View>
              ) : (
                <View style={{ height: 35 }} />
              )}
            </TouchableOpacity>
          );
        })}
        {selectedSplitBy === splitTypeEnam.unEqually ? (
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
              People : {splitUsers?.length}
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
            customeBtnStyle={styles.closeBtn}
            title="CLOSE"
          />
          <GenericButton
            onPress={() => {
              if (selectedSplitBy === splitTypeEnam.equally) {
                let anySelected = splitUsers.find((item) => item.isSelected);
                if (anySelected) {
                  onSaveData(selectedSplitBy);
                } else {
                  showToast({
                    type: "error",
                    mainText: `Select any one member`,
                  });
                }
              } else {
                if (remainingAmt === 0) {
                  onSaveData(selectedSplitBy);
                } else {
                  showToast({
                    type: "error",
                    mainText: `Sum Split amount should equal to ${billAmount}`,
                  });
                }
              }
            }}
            customeBtnStyle={{ width: "45%", marginTop: 0 }}
            title="SAVE"
          />
        </View>
      </BottomSheetView>
    </GenericModal>
  );
};

export default SplitAmountPicker;

const styles = StyleSheet.create({
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
  innerView: {
    height: 20,
    width: 23,

    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 4,
    borderColor: "gray",
  },
  userBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 16,
  },
  multiIcon: {
    height: 18,
    width: 18,
    tintColor: "white",
    resizeMode: "stretch",
  },
  closeBtn: {
    width: "45%",
    marginTop: 0,
    borderColor: "red",
    paddingVertical: 11,
  },
  bottomBtnView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    // paddingBottom: 16,
    // backgroundColor: "red",
  },
  middleView: {
    marginHorizontal: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payerName: {
    color: "gray",
    fontWeight: "600",
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
});
