import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import axios from "axios";
import config from "../../server/config/default";

export default function LiveStreamPlayer(props) {
  const [stream, setStream] = useState(false);
  const [videoJsOptions, setVideoJsOptions] = useState(null);
  const videoNode = useRef();
  const player = useRef();
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
                "http://127.0.0.1:" +
                config.rtmp_server.http.port +
                "/live/" +
                res.data.stream_key +
                "/index.m3u8",
              type: "application/x-mpegURL",
            },
          ],
          fluid: true,
        });
      });
  }, []);
  useEffect(() => {
    if (videoNode && videoJsOptions) {
      player.current = videojs(
        videoNode,
        videoJsOptions,
        function onPlayerReady() {
          console.log("onPlayerReady", this);
        }
      );
    }
  }, [videoNode, videoJsOptions]);

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [player]);

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
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
