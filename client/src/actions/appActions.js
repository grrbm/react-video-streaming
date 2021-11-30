import { SET_VIDEOS, SET_UPLOAD, SET_VIDEOS1 } from "./types";
import { setErr } from "./msgActions";
import Axios from "axios";
export const uploadVideo =
  (file, videoInformation, groupId) => (dispatch, getState) => {
    const formData = new FormData();
    const {
      app: { videos, videos1 },
    } = getState();
    formData.append("file", file);
    dispatch(setUpload(true));
    Axios.post("/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(({ data: video }) => {
        dispatch(setVideos([...videos, video]));
        Axios.post(
          "/videoinformation",
          {
            videoInformation: videoInformation,
            videoId: video._id,
            group: groupId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(({ data: video }) => {
          dispatch(setVideos1([...videos1, video]));
        });
      })
      .catch(({ response = {} }) => {
        dispatch(setUpload(false));
        const status = response.status;
        if (status === 500) setErr("Unknown error occured");
      });
  };

export const fetchVideos = () => (dispatch) => {
  Axios.get("/video/all")
    .then(({ data: videos }) => {
      dispatch(setVideos1(videos));
    })
    .catch(({ response = {} }) => {
      const status = response.status;
      if (status === 500) setErr("Unknown error occured");
    });
};

export const performLogin = (email, password) => async (dispatch, getState) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  await Axios.post("/login", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("Received response.");
    })
    .catch((error) => {
      console.log("There was an error. " + error);
      setErr("There was an error. " + error);
    });
};

const setVideos = (videos) => ({ type: SET_VIDEOS, payload: videos });
const setVideos1 = (videos) => ({ type: SET_VIDEOS1, payload: videos });

const setUpload = (percent) => ({ type: SET_UPLOAD, payload: percent });
