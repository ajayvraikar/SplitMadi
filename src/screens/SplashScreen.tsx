import { Animated, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { APP_LOGO } from "../assets/Images";
import { getDataFromAsync, LOGIN_USER_DATA } from "../utils/asyncStorageUtils";
import { CommonActions } from "@react-navigation/native";
import { updateLoginUserData } from "../redux/actions";
import { useDispatch } from "react-redux";
interface Props {
  navigation?: any;
}
const SplashScreen: React.FC<Props> = (props) => {
  const [scaleValue] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1, // Final scale value is 1 (100%)
      duration: 700, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for performance
    }).start(); // Start the animation
  }, [scaleValue]);
  useEffect(() => {
    setTimeout(() => {
      getDataFromAsync(LOGIN_USER_DATA).then((value) => {
        if (value) {
          dispatch(updateLoginUserData(value));
        }
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: value === null ? "LoginScreen" : "DrawerNavigator",
              },
            ],
          })
        );
      });
    }, 1000);
  }, []);
  return (
    <Animated.View
      style={[styles.mainView, { transform: [{ scale: scaleValue }] }]}
    >
      <Animated.View
        style={{
          width: 150,
          height: 150,
          borderWidth: 1,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#2faff5",
          transform: [{ scale: scaleValue }],
        }}
      >
        <Animated.Image
          source={APP_LOGO}
          style={{
            width: 120,
            height: 120,
            transform: [{ scale: scaleValue }],
          }}
        />
      </Animated.View>

      <Text style={styles.text}>SplitMadi</Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "#2faff5",
    fontWeight: "700",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});
