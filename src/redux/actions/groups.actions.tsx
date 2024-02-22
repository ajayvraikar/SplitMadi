import { ActionCreator } from "redux";
import {
  GroupInterFace,
  GroupsActionTypes,
  UPDATE_SELECTED_GROUP,
} from "../types/groups.types";

export const updateSelectedGroup: ActionCreator<GroupsActionTypes> = (
  posts: GroupInterFace
) => {
  return { type: UPDATE_SELECTED_GROUP, payload: posts };
};
