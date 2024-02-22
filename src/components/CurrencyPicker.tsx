import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { RefObject, useEffect, useRef } from "react";
import GenericModal from "./GenericModal";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import currencyData from "../constants/countyCurrency.json";
import { CROSS } from "../assets/Images";
type ItemProps = {
  country?: string;
  currency?: string;
  symbol?: string;
  flagURL?: string;
  isSelected?: boolean;
  onPress?: () => void;
};
interface CurrencyPickerProps {
  currencyPickerRef: RefObject<BottomSheetModal>;
  selectedCurrency?: ItemProps;
  onSelectedCurrency: (values: any) => void;
}

const CurrencyCard: React.FC<ItemProps> = ({
  currency,
  flagURL,
  symbol,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.cardView,
        { borderColor: isSelected ? "#2faff5" : "black" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            height: 20,
            width: 20,
            marginRight: 16,
            borderWidth: 0.8,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            borderColor: isSelected ? "#2faff5" : "black",
          }}
        >
          {isSelected ? (
            <View
              style={{
                height: 10,
                width: 10,
                backgroundColor: "#2faff5",
                borderRadius: 11,
              }}
            />
          ) : null}
        </View>
        <Text
          style={{
            color: isSelected ? "#2faff5" : "black",
            fontSize: 15,
            fontWeight: "700",
            width: 35,
          }}
        >
          {symbol}
        </Text>
        <Text
          style={{
            color: isSelected ? "#2faff5" : "black",
            fontSize: 15,
            fontWeight: "400",
          }}
        >
          {currency}
        </Text>
      </View>
      <View style={{ borderWidth: 0.4 }}>
        <Image height={15} width={30} source={{ uri: flagURL }} />
      </View>
    </TouchableOpacity>
  );
};

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  currencyPickerRef,
  selectedCurrency,
  onSelectedCurrency,
}) => {
  function getCurrencyData(): Array<any> {
    let currencyData_ = currencyData.filter(
      (item) => item.currency !== selectedCurrency?.currency
    );
    return [selectedCurrency, ...currencyData_];
  }
  return (
    <GenericModal
      bottomSheetModalRef={currencyPickerRef}
      snapPointsArray={["75%"]}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 18, fontWeight: "600" }}>
            Select your Currency
          </Text>
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image style={{ height: 40, width: 40 }} source={CROSS} />
          </TouchableOpacity>
        </View>
        <BottomSheetFlatList
          keyExtractor={(item) => item.country}
          data={getCurrencyData()}
          renderItem={({ item }) => (
            <CurrencyCard
              {...item}
              isSelected={selectedCurrency?.currency === item.currency}
              onPress={() => {
                onSelectedCurrency(item);
              }}
            />
          )}
        />
      </View>
    </GenericModal>
  );
};

export default CurrencyPicker;

const styles = StyleSheet.create({
  cardView: {
    borderWidth: 0.4,
    marginBottom: 12,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
