import { SET_ERR, CLEAR_MSG_ERR, SET_MSG } from '../actions/types';
const initState = {
  msg: {},
  err: false,
};

export default function (state = initState, { type, payload }) {
  switch (type) {
    case SET_ERR:
      return {
        err: true,
        msg: payload,
      };

    case SET_MSG:
      return {
        err: false,
        msg: payload,
      };

    case CLEAR_MSG_ERR:
      return initState;

    default:
      return state;
  }
}
