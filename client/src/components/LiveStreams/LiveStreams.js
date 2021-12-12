import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LiveStreams.scss";
import config from "../../config/default";

export default function LiveStreams(props) {
  const [liveStreams, setLiveStreams] = useState([]);
  const environment = process.env.NODE_ENV;
  let baseUrl;
  console.log("THIS IS THE ENVIRONMENT: " + environment);
  if (environment === "development") {
    baseUrl = "http://127.0.0.1";
  } else {
    //if it's in production
    baseUrl = "http://localhost";
  }

  useEffect(() => {
    getLiveStreams();
  }, []);

  function getLiveStreams() {
    const fullUrl =
      `${baseUrl}:` + config.rtmp_server.http.port + "/api/streams";
    axios
      .get(fullUrl)
      .then((res) => {
        let streams = res.data;
        if (typeof streams["live"] !== "undefined") {
          getStreamsInfo(streams["live"]);
        }
      })
      .catch((error) => {
        console.log("Error getting live streams");
        console.log("This is the full URL: " + fullUrl);
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
      })
      .catch((error) => {
        console.log("Error getting streams info");
      });
  }

  if (!liveStreams || !Array.isArray(liveStreams) || liveStreams.length === 0) {
    return <div className="text-white">Found Nothing</div>;
  }
  let streams = liveStreams.map((stream, index) => {
    return (
      <div
        className="stream xs:grid-cols-12 sm:grid-cols-12 md:grid-cols-3 lg:grid-cols-4 text-white"
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

      <div className="streams row flex flex-row">{streams}</div>
    </div>
  );
}
