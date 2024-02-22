import AsyncStorage from "@react-native-async-storage/async-storage";

export const LOGIN_USER_DATA = "LOGIN_USER_DATA";
export const SELECTED_GROUP = "SELECTED_GROUP";

export const storeIntoAsync = async (keyName: string, valueToStore: any) => {
  try {
    const jsonValue = JSON.stringify(valueToStore);
    await AsyncStorage.setItem(keyName, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getDataFromAsync = async (keyName: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(keyName);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const removeFromAsync = async (keyName: string) => {
  try {
    await AsyncStorage.removeItem(keyName);
  } catch (e) {
    // remove error
  }

  console.log("Done.");
};
