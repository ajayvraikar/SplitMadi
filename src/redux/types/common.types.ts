export interface UsersDataInterFace {
  createdOn?: string;
  mobileNumber?: string;
  password?: string;
  userId?: string;
  userName?: string;
  amount?: number;
}

export interface SplitUserDataInterFace {
  createdOn?: string;
  mobileNumber?: string;
  password?: string;
  userId?: string;
  userName?: string;
  amount?: number;
  isShare?: boolean;
  isSelected?: boolean;
}

// {"balance": "0", "groupId": "NLZYCY", "mobileNumber": "9756456434", "userId": "9756456434", "userName": "Gopala"}
export const UPDATE_LOGIN_USER = "UPDATE_LOGIN_USER";

interface UpdateLoginUserAction {
  type: typeof UPDATE_LOGIN_USER;
  payload: UsersDataInterFace;
}

export type CommonActionTypes = UpdateLoginUserAction;
