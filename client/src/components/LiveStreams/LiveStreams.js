import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LiveStreams.scss";
import config from "../../config/default";

export default function LiveStreams(props) {
  const [liveStreams, setLiveStreams] = useState([]);

  useEffect(() => {
    getLiveStreams();
  }, []);

  function getLiveStreams() {
    axios
      .get("http://127.0.0.1:" + config.rtmp_server.http.port + "/api/streams")
      .then((res) => {
        let streams = res.data;
        if (typeof (streams["live"] !== "undefined")) {
          getStreamsInfo(streams["live"]);
        }
      });
  }

  function getStreamsInfo(liveStreams) {
    axios
      .get("/streams/info", {
        params: {
          streams: liveStreams,
        },
      })
      .then((res) => {
        setLiveStreams(res.data);
      });
  }

  if (!liveStreams || !Array.isArray(liveStreams)) {
    return <div className="text-white">Found Nothing</div>;
  }
  let streams = liveStreams.map((stream, index) => {
    return (
      <div
        className="stream col-xs-12 col-sm-12 col-md-3 col-lg-4 text-white"
        key={index}
      >
        <span className="live-label">LIVE</span>
        <Link to={"/stream/" + stream.username}>
          <div className="stream-thumbnail">
            <img src={"/thumbnails/" + stream.stream_key + ".png"} />
          </div>
        </Link>

        <span className="username">
          <Link to={"/stream/" + stream.username}>{stream.username}</Link>
        </span>
      </div>
    );
  });

  return (
    <div className="container mt-5 text-white">
      <h4>Live Streams</h4>
      <hr className="my-4" />

      <div className="streams row">{streams}</div>
    </div>
  );
}
