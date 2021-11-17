import {
  SET_VIDEOS,
  SET_LOADING,
  SET_UPLOAD,
  SET_VIDEOS1,
} from "../actions/types";
const initState = {
  videos: [],
  video: null,
  loading: false,
  upload: false,
  videos1: [],
};
export default function (state = initState, { type, payload }) {
  switch (type) {
    case SET_VIDEOS:
      return { ...state, videos: payload, upload: false };
    case SET_LOADING:
      return { ...state, loading: payload };
    case SET_UPLOAD:
      return { ...state, upload: payload };
    case SET_VIDEOS1:
      return { ...state, videos1: payload, upload: false };
    default:
      return state;
  }
}
