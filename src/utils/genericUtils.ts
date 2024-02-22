import moment from "moment";
import Toast from "react-native-toast-message";

export function getCurrentTime(): string {
  return moment(new Date()).format("DD-MM-YYYY, hh:mm A");
}

export function getOnlyNumbers(text: string = ""): string {
  return text?.replace(/\D/g, "");
}

type ToastType = "success" | "error" | "info";

interface ShowToastParams {
  mainText?: string;
  subText?: string;
  type?: ToastType;
  bottomOffset?: number;
}

export const showToast = ({
  mainText,
  subText = "",
  type = "success",
  bottomOffset = 120,
}: ShowToastParams) => {
  Toast.show({
    type: type,
    text1: mainText,
    text2: subText,
    bottomOffset: bottomOffset,
    // position: "top",
  });
};

export function generateGroupId(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export function capitalizeFLetter(string: string = ""): string {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}
