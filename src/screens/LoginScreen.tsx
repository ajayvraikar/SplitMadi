import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { APP_LOGO } from "../assets/Images";
import GenericButton from "../components/GenericButton";
import GenericInput from "../components/GenericInput";
import firestore from "@react-native-firebase/firestore";
import { getOnlyNumbers, showToast } from "../utils/genericUtils";
import { LOGIN_USER_DATA, storeIntoAsync } from "../utils/asyncStorageUtils";
import { useDispatch } from "react-redux";
import { updateLoginUserData } from "../redux/actions";

interface Props {
  navigation: any;
}
const LoginScreen: React.FC<Props> = (props) => {
  interface UsersDataInterFace {
    createdOn?: string;
    mobileNumber: string;
    password: string;
    userId?: string;
    userName?: string;
  }
  const [loginFields, setLoginFields] = useState<UsersDataInterFace>({
    mobileNumber: "9742519103",
    password: "Ajay@123",
  });
  const [loginErrorF, setLoginErrorF] = useState<UsersDataInterFace>({
    mobileNumber: "",
    password: "",
  });
  const [usersData, setUsersData] = useState<UsersDataInterFace[]>([]);
  const ref = firestore().collection("Users");

  const dispatch = useDispatch();
  useEffect(() => {
    return ref.onSnapshot((querySnapshot) => {
      let list: UsersDataInterFace[] = [];

      querySnapshot?.forEach((doc) => {
        console.log("docdocdoc", doc.data(), doc.id);

        const { createdOn, mobileNumber, password, userId, userName } =
          doc.data();
        list.push({
          createdOn,
          mobileNumber,
          password,
          userId,
          userName,
        });
      });
      setUsersData(list);
    });
  }, []);

  function validSignUpFields(onlyMobile = false) {
    let isValid = true;
    let mobileError = "";
    let passwordErr = "";

    if (loginFields.mobileNumber === "") {
      isValid = false;
      mobileError = "Please enter valid mobile no";
    }
    if (loginFields.password === "") {
      isValid = false;
      passwordErr = "Please enter valid password";
    }
    const isValidInput = /^[6-9][0-9]{9}$/.test(loginFields.mobileNumber);
    if (!isValidInput) {
      isValid = false;
      mobileError = "Enter valid 10 digit mobile no";
    }
    setLoginErrorF({
      mobileNumber: mobileError,
      password: !onlyMobile ? passwordErr : "",
    });
    return isValid;
  }
  useEffect(() => {
    if (loginFields.mobileNumber) {
      validSignUpFields(true);
    }
  }, [loginFields.mobileNumber]);
  async function onLoginClick() {
    // NativeModules.MyContactsModule.getAllPhotos().then((res: any) => {
    //   console.log("result", res);
    // });
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
    //     {
    //       title: "Cool Photo App Camera Permission",
    //       message:
    //         "Cool Photo App needs access to your camera " +
    //         "so you can take awesome pictures.",
    //       buttonNeutral: "Ask Me Later",
    //       buttonNegative: "Cancel",
    //       buttonPositive: "OK",
    //     }
    //   );
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log("You can use the camera", granted);
    //   } else {
    //     console.log("Camera permission denied", granted);
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
    try {
      const { PhotoPickerModule } = NativeModules;

      // Call the native method
      PhotoPickerModule.getAllPhotos(
        2,
        40,
        (error: any, photoDataList: any) => {
          console.log("Photos fetched:", photoDataList);
        }
      );
      // NativeModules.MyContactsModule.getAllPhotos(
      //   (error: string | null, photoPaths: any | null) => {
      //     if (error) {
      //       console.error("Error fetching photos:", error);
      //     } else {
      //       console.log("Fetched Photos:", photoPaths);
      //       if (photoPaths && photoPaths.length > 0) {
      //         // setPhotos(photoPaths);
      //       } else {
      //         console.log("No photos available");
      //       }
      //     }
      //   }
      // );
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
    // NativeModules.MyContactsModule.openSystemSoundPicker()
    //   .then((res: any) => {
    //
    //     if (res === "back") {
    //       //
    //     } else {
    //       NativeModules.MyContactsModule.saveSelectedSoundURI(
    //         res === "none" ? null : res
    //       );
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log("error", err);
    //   });
    // if (validSignUpFields()) {
    //   let userData_ = usersData.find(
    //     (item) => item.mobileNumber === loginFields.mobileNumber
    //   );
    //   if (userData_) {
    //     if (userData_.password === loginFields.password) {
    //       storeIntoAsync(LOGIN_USER_DATA, userData_);
    //       dispatch(updateLoginUserData(userData_));
    //       showToast({ mainText: "Login Successfully", bottomOffset: 60 });
    //       props.navigation.dispatch(
    //         CommonActions.reset({
    //           index: 0,
    //           routes: [
    //             {
    //               name: "DrawerNavigator",
    //             },
    //           ],
    //         })
    //       );
    //     } else {
    //       showToast({
    //         mainText: "Invalid Password",
    //         type: "error",
    //         bottomOffset: 60,
    //       });
    //     }
    //   } else {
    //     showToast({
    //       mainText: "You Don`t Have Account with SplitMadi",
    //       type: "error",
    //       bottomOffset: 60,
    //     });
    //   }
    // }
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
        <Text style={styles.screenTitle}>Welcome To SplitMadi</Text>

        <GenericInput
          title="Mobile Number"
          value={loginFields.mobileNumber}
          onChangeText={(value) => {
            setLoginFields({
              ...loginFields,
              mobileNumber: getOnlyNumbers(value),
            });
          }}
          placeholder={"Enter Mobile Number"}
          customMainStyle={{
            width: "85%",
            paddingHorizontal: 0,
            marginBottom: 24,
          }}
          keyboardType={"number-pad"}
        />
        {loginErrorF.mobileNumber && (
          <Text style={styles.errorMsg}>{loginErrorF.mobileNumber}</Text>
        )}
        <GenericInput
          title="Password"
          value={loginFields.password}
          onChangeText={(value) => {
            setLoginFields({
              ...loginFields,
              password: value,
            });
          }}
          customMainStyle={{
            width: "85%",
            paddingHorizontal: 0,
            marginBottom: 24,
          }}
          placeholder={"Enter Password"}
        />
        {loginErrorF.password && loginFields.password === "" && (
          <Text style={styles.errorMsg}>{loginErrorF.password}</Text>
        )}
        <GenericButton
          onPress={() => {
            onLoginClick();
          }}
          title="LOGIN"
        />
        <GenericButton
          onPress={() => {
            NativeModules.MyContactsModule.showNotification("Hi", "Hi Ajay");
          }}
          title="TRIGGER NOTI"
        />
        <Text style={{ marginVertical: 16 }}>Or</Text>
        <GenericButton
          title="Dont have an account? Sign Up"
          isFilled={false}
          customeBtnStyle={{ marginTop: 0 }}
          onPress={async () => {
            let result =
              await NativeModules.MyContactsModule.getSelectedSoundURI();
            console.log("NativeModules", result);
            // props.navigation.navigate("SignUp")
          }}
        />
      </ScrollView>
    </View>
  );
};

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
export default LoginScreen;
