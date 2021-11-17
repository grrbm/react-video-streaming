import { SET_LANG } from "../actions/types";
const initState = {
  language: "EN",
};
export default function (state = initState, { type, payload }) {
  switch (type) {
    case SET_LANG:
      return { ...state, language: payload };
    default:
      return state;
  }
}
