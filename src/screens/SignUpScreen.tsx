import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { APP_LOGO } from "../assets/Images";
import GenericInput from "../components/GenericInput";
import GenericButton from "../components/GenericButton";
import firestore from "@react-native-firebase/firestore";
import {
  getCurrentTime,
  getOnlyNumbers,
  showToast,
} from "../utils/genericUtils";
import { CommonActions } from "@react-navigation/native";

interface Props {
  navigation?: any;
}
const SignUpScreen: React.FC<Props> = (props) => {
  interface signUpFieldsData {
    userName: string;
    mobileNumber: string;
    password: string;
  }

  const [signUpFields, setSignUpFields] = useState<signUpFieldsData>({
    mobileNumber: "",
    password: "",
    userName: "",
  });

  const [signUpErrorMsg, setSignUpErrorMsg] = useState<signUpFieldsData>({
    mobileNumber: "",
    password: "",
    userName: "",
  });

  const ref = firestore().collection("Users");
  function validSignUpFields(onlyMobile = false) {
    let isValid = true;
    let userNameErr = "";
    let mobileError = "";
    let passwordErr = "";

    if (signUpFields.userName === "") {
      isValid = false;
      userNameErr = "Please enter user name";
    }
    if (signUpFields.mobileNumber === "") {
      isValid = false;
      mobileError = "Please enter valid mobile no";
    }
    if (signUpFields.password === "") {
      isValid = false;
      passwordErr = "Please enter valid password";
    }
    const isValidInput = /^[6-9][0-9]{9}$/.test(signUpFields.mobileNumber);
    if (!isValidInput) {
      isValid = false;
      mobileError = "Enter valid 10 digit mobile no";
    }
    setSignUpErrorMsg({
      mobileNumber: mobileError,
      password: !onlyMobile ? passwordErr : "",
      userName: !onlyMobile ? userNameErr : "",
    });

    return isValid;
  }
  useEffect(() => {
    if (signUpFields.mobileNumber) {
      validSignUpFields(true);
    }
  }, [signUpFields.mobileNumber]);

  async function signUpIntoAccount() {
    try {
      await ref.add({
        createdOn: getCurrentTime(),
        mobileNumber: signUpFields.mobileNumber,
        password: signUpFields.password,
        userId: signUpFields.mobileNumber,
        userName: signUpFields.userName,
      });
      console.log("created");
      showToast({
        mainText: "Account Created Successfully",
        bottomOffset: 70,
      });
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "Home",
            },
          ],
        })
      );
    } catch (err) {
      showToast({
        mainText: "Something went wrong",
        bottomOffset: 70,
        type: "error",
      });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      >
        <View style={styles.imageView}>
          <Image style={{ height: 100, width: 100 }} source={APP_LOGO} />
        </View>
        <Text style={styles.screenTitle}>Create Account with SplitMadi</Text>

        <GenericInput
          title="User Name"
          value={signUpFields.userName}
          onChangeText={(value) => {
            setSignUpFields({ ...signUpFields, userName: value });
          }}
          placeholder={"Enter user name"}
          customMainStyle={{
            width: "85%",
            paddingHorizontal: 0,
            marginBottom: 24,
          }}
        />
        {signUpErrorMsg.userName && signUpFields.userName === "" && (
          <Text style={styles.errorMsg}>{signUpErrorMsg.userName}</Text>
        )}
        <GenericInput
          title="Mobile Number"
          value={signUpFields.mobileNumber}
          onChangeText={(value) => {
            setSignUpFields({
              ...signUpFields,
              mobileNumber: getOnlyNumbers(value),
            });
          }}
          customMainStyle={{
            width: "85%",
            paddingHorizontal: 0,
            marginBottom: 24,
          }}
          placeholder={"Enter Mobile Number"}
        />
        {signUpErrorMsg.mobileNumber && (
          <Text style={styles.errorMsg}>{signUpErrorMsg.mobileNumber}</Text>
        )}
        <GenericInput
          title="Password"
          value={signUpFields.password}
          onChangeText={(value) => {
            setSignUpFields({ ...signUpFields, password: value });
          }}
          customMainStyle={{
            width: "85%",
            paddingHorizontal: 0,
            marginBottom: 24,
          }}
          placeholder={"Enter Password"}
        />
        {signUpErrorMsg.password && signUpFields.password === "" && (
          <Text style={styles.errorMsg}>{signUpErrorMsg.password}</Text>
        )}
        <GenericButton
          onPress={() => {
            if (validSignUpFields()) {
              signUpIntoAccount();
            }
          }}
          title="JOIN US"
        />
        <Text style={{ marginVertical: 16 }}>Or</Text>
        <GenericButton
          title="Already have an account? Login"
          isFilled={false}
          customeBtnStyle={{ marginTop: 0 }}
          onPress={() => props.navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    color: "#2faff5",
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 40,
  },
  imageView: {
    borderWidth: 0.6,
    padding: 12,
    borderColor: "#2faff5",
    borderRadius: 60,
    marginBottom: 12,
    marginTop: 40,
  },
  errorMsg: {
    color: "red",
    fontSize: 12,
    marginTop: -16,
    marginBottom: 16,
    width: "82%",
  },
});
