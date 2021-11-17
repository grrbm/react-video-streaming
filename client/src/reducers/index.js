import { combineReducers } from "redux";
import appReducer from "./appReducer";
import msgReducer from "./msgReducer";
import langReducer from "./langReducer";
export default combineReducers({
  msg: msgReducer,
  app: appReducer,
  lang: langReducer,
});
