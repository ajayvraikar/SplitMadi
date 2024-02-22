import { combineReducers } from "redux";
import { commonDataReducer } from "./common.reducers";
import { groupReducer } from "./groups.reducers";

export const rootReducer = combineReducers({
  selectedGroup: groupReducer,
  commonData: commonDataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
