import { SET_VIDEOS, SET_LOADING, SET_UPLOAD } from '../actions/types';
const initState = {
  videos: [],
  video: null,
  loading: false,
  upload: false,
};
export default function (state = initState, { type, payload }) {
  switch (type) {
    case SET_VIDEOS:
      return { ...state, videos: payload, upload: false };
    case SET_LOADING:
      return { ...state, loading: payload };
    case SET_UPLOAD:
      return { ...state, upload: payload };
    default:
      return state;
  }
}
