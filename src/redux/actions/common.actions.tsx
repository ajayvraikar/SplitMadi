import { ActionCreator } from "redux";
import {
  CommonActionTypes,
  UPDATE_LOGIN_USER,
  UsersDataInterFace,
} from "../types/common.types";

export const updateLoginUserData: ActionCreator<CommonActionTypes> = (
  loginUserData: UsersDataInterFace
) => {
  return { type: UPDATE_LOGIN_USER, payload: loginUserData };
};
