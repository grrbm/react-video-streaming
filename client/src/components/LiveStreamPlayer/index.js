import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import axios from "axios";
import config from "../../config/default";
import "./LiveStreamPlayer.scss";

export default function LiveStreamPlayer(props) {
  const [stream, setStream] = useState(false);
  const [videoJsOptions, setVideoJsOptions] = useState(null);
  const videoNode = useRef();
  const player = useRef();

  const environment = process.env.NODE_ENV;
  let baseUrl;
  if (environment === "development") {
    baseUrl = "http://127.0.0.1";
  } else {
    //if it's in production
    baseUrl = "http://localhost";
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
                config.rtmp_server.http.port +
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
    <div className="row">
      <div className="xs:grid-cols-12 sm:grid-cols-12 md:grid-cols-10 lg:grid-cols-8 mx-auto mt-5">
        {stream ? (
          <div data-vjs-player>
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
