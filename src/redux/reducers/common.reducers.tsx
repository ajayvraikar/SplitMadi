import {
  CommonActionTypes,
  UPDATE_LOGIN_USER,
  UsersDataInterFace,
} from "../types/common.types";

const initialFeedState: UsersDataInterFace = {};

export function commonDataReducer(
  state: UsersDataInterFace = initialFeedState,
  action: CommonActionTypes
): UsersDataInterFace {
  switch (action.type) {
    case UPDATE_LOGIN_USER: {
      return action.payload;
    }
    default:
      return state;
  }
}
