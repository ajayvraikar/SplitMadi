import {
  GroupInterFace,
  GroupsActionTypes,
  UPDATE_SELECTED_GROUP,
} from "../types/groups.types";

const initialFeedState: GroupInterFace = {};

export function groupReducer(
  state: GroupInterFace = initialFeedState,
  action: GroupsActionTypes
): GroupInterFace {
  switch (action.type) {
    case UPDATE_SELECTED_GROUP: {
      return action.payload;
    }
    default:
      return state;
  }
}
