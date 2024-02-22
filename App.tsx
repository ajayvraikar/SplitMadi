import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import store from "./src/redux/store";

const App: React.FC = () => {
  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2faff5" }}>
      <Provider store={store}>
        <StatusBar backgroundColor={"#2faff5"} />
        <AppNavigator />
        <Toast position="bottom" />
      </Provider>
    </SafeAreaView>
  );
};

export default App;
