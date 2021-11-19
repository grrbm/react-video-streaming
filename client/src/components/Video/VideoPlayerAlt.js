import React from "react";
import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import Videos1 from "../Video/Videos1";
import * as Language from "../../assets/constant/Language";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useDispatch } from "react-redux";
import Share from "../Share";
import { SET_VIDEOS, SET_UPLOAD, SET_VIDEOS1 } from "../../actions/types";

const VideoPlayerAlt = ({ events, root, name, match }) => {
  const videoRef = useRef();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.lang.language);
  const setVideos1 = (videos) => ({ type: SET_VIDEOS1, payload: videos });

  const [stall, setStall] = useState(false);
  const [source, setSource] = useState(false);
  const [play, setPlay] = useState(true);
  const [volume, setVolume] = useState(true);
  const [current, setCurrent] = useState(0);

  const forward = (video) => (video.currentTime += 10);
  const replay = (video) => (video.currentTime -= 10);
  const togglePlay = () => setPlay((prev) => !prev);
  const keyControl = (K) => {
    const video = videoRef.current;
    if (K.code === "ArrowRight") {
      forward(video);
    } else if (K.code === "ArrowLeft") {
      replay(video);
    }
  };
  const animateBar = () => {
    const video = videoRef.current;
    const current = video.currentTime / video.duration;
    setCurrent(() => current);
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!(video.src || source)) {
      const id = match.params.id;
      const HlsURL = `/video/${id}/video.m3u8`;
      const normalURL = `/video/${id}/video`;
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(HlsURL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          play && video.play();
        });
      } else {
        setSource({ src: normalURL });
      }
    }
    play ? video.play() : video.pause();
    video.volume = volume ? 1 : 0;
    document.addEventListener("keydown", keyControl);
    document.addEventListener("keypress", togglePlay);
    return () => {
      document.removeEventListener("keydown", keyControl);
      document.removeEventListener("keypress", togglePlay);
    };
  }, [play, volume]);
  useEffect(() => {
    Axios.get("/video/all")
      .then(({ data: videos }) => {
        videos.forEach((video) => {
          video.group = "1";
        });
        dispatch(setVideos1(videos));
      })
      .catch(({ response = {} }) => {
        const status = response.status;
        if (status === 500) console.log("error");
      });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full bg-black">
        <video
          ref={videoRef}
          controls={true}
          className="w-full sm:w-3/4 sm:mx-auto h-full"
          onTimeUpdate={animateBar}
          onPlaying={() => setStall(false)}
          onWaiting={() => setStall(true)}
          onStalled={() => setStall(true)}
        >
          {source && <source src={source.src}></source>}
        </video>
      </div>
      <Share />
      <div className="content">
        <div className="video-group-title">{Language.SONGS[language]}</div>
        <Videos1 groupId="1" />
      </div>
    </div>
  );
};

export default VideoPlayerAlt;
