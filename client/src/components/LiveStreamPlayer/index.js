import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import axios from "axios";
import config from "../../config/default";
import clsx from "clsx";
import "./LiveStreamPlayer.css";
import livePlayerStyles from "./LiveStreamPlayer.module.scss";

export default function LiveStreamPlayer(props) {
  const [stream, setStream] = useState(false);
  const [videoJsOptions, setVideoJsOptions] = useState(null);
  const videoNode = useRef();
  const player = useRef();

  const environment = process.env.NODE_ENV;
  let baseUrl;
  let port;
  if (environment === "development") {
    baseUrl = "http://127.0.0.1";
    port = config.rtmp_server.http.port;
  } else {
    //if it's in production
    baseUrl = config.productionUrl;
    port = config.rtmp_server.https.port;
  }
  useEffect(() => {
    axios
      .get("/user", {
        params: {
          username: props.match.params.username,
        },
      })
      .then((res) => {
        setStream(true);
        setVideoJsOptions({
          autoplay: false,
          controls: true,
          sources: [
            {
              src:
                `${baseUrl}:` +
                port +
                "/live/" +
                res.data.stream_key +
                "/index.m3u8",
              type: "application/x-mpegURL",
            },
          ],
          fluid: true,
        });
      })
      .catch((error) => {
        console.log("There was an error fetching the user info.");
      });
  }, []);
  useEffect(() => {
    if (videoJsOptions) {
      player.current = videojs(
        videoNode.current,
        videoJsOptions,
        function onPlayerReady() {
          console.log("onPlayerReady");
        }
      );
    }
  }, [videoJsOptions]);

  useEffect(() => {
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, []);

  return (
    <div className={clsx(livePlayerStyles.mainDiv, "row")}>
      <div className="xs:grid-cols-12 sm:grid-cols-12 md:grid-cols-10 lg:grid-cols-8 mx-auto pt-5 max-w-6xl">
        {stream ? (
          <div data-vjs-player className="">
            <video
              ref={(node) => (videoNode.current = node)}
              className="video-js vjs-big-play-centered"
            />
          </div>
        ) : (
          " Loading ... "
        )}
      </div>
    </div>
  );
}
