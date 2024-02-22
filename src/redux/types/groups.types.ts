export interface GroupInterFace {
  createdBy?: string;
  createdOn?: string;
  currency?: string;
  description?: string;
  groupId?: string;
  groupLogo?: string;
  groupName?: string;
  isOnline?: boolean;
}

export interface GroupUsersInterFace {
  groupId?: string;
  userId?: string;
  userName?: string;
  mobileNumber?: string;
  balance?: string;
}

// {"balance": "0", "groupId": "NLZYCY", "mobileNumber": "9756456434", "userId": "9756456434", "userName": "Gopala"}
export const UPDATE_SELECTED_GROUP = "UPDATE_SELECTED_GROUP";

interface UpdateSelectedGroupAction {
  type: typeof UPDATE_SELECTED_GROUP;
  payload: GroupInterFace;
}

export type GroupsActionTypes = UpdateSelectedGroupAction;
