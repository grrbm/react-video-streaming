import { combineReducers } from "redux";
import appReducer from "./appReducer";
import msgReducer from "./msgReducer";
export default combineReducers({
  msg: msgReducer,
  app: appReducer,
});
