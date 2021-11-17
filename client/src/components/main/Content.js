import React, { useEffect } from "react";
import { Videos } from "../Video";
import Videos1 from "../Video/Videos1";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { SET_VIDEOS, SET_UPLOAD, SET_VIDEOS1 } from "../../actions/types";
import { useSelector } from "react-redux";
import * as Language from "../../assets/constant/Language";
const Content = () => {
  const setVideos1 = (videos) => ({ type: SET_VIDEOS1, payload: videos });
  const dispatch = useDispatch();
  const language = useSelector((state) => state.lang.language);
  useEffect(() => {
    Axios.get("/video/all")
      .then(({ data: videos }) => {
        dispatch(setVideos1(videos));
      })
      .catch(({ response = {} }) => {
        const status = response.status;
        if (status === 500) console.log("error");
      });
  }, []);
  return (
    <div className="content">
      <div className="video-group-title">{Language.EVENTS[language]}</div>
      <Videos1 groupId="1" />
      <div className="video-group-title">{Language.TOP_PICKS[language]}</div>
      <Videos1 groupId="2" />
      <div className="video-group-title">{Language.TOP_PICKS[language]}</div>
      <Videos1 groupId="3" />
    </div>
  );
};

export default Content;
