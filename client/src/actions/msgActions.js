import { SET_ERR, CLEAR_MSG_ERR, SET_MSG } from './types';

export const setErr = txt => ({ type: SET_ERR, payload: txt });

export const setMsg = txt => ({ type: SET_MSG, payload: txt });

export const clearMsg = txt => ({ type: CLEAR_MSG_ERR });
