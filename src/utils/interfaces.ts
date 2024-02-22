export interface UsersDataInterFace {
  createdOn?: string;
  mobileNumber?: string;
  password?: string;
  userId?: string;
  userName?: string;
}

// export interface GroupUsersInterFace {
//   groupId?: string;
//   userId?: string;
//   userName?: string;
//   mobileNumber?: string;
//   balance?: string;
// }
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

export interface CategoryInterface {
  id: number;
  name?: string;
  icon?: string;
}

export enum memberType {
  singleMembers = "Single members",
  multipleMembers = "Multiple members",
}

export enum splitBy {
  equally = "Equally",
  unEqually = "Unequally",
}

export enum splitTypeEnam {
  equally = "Equally",
  unEqually = "UnEqually",
}
