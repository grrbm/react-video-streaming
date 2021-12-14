import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import settingStyle from "./Settings.module.scss";

export default function Settings(props) {
  const history = useHistory();
  const [loggedUser, setLoggedUser] = useState();
  const [streamKey, setStreamKey] = useState("");

  useEffect(() => {
    if (loggedUser) {
      getStreamKey();
    }
  }, [loggedUser]);
  useEffect(() => {
    const getLoggedUser = async () => {
      try {
        const result = await axios.get("/loggedUser");
        setLoggedUser(result.data);
      } catch (error) {
        console.log("Could not get logged user. " + error);
      }
    };
    getLoggedUser();
  }, []);

  function generateStreamKey(e) {
    axios
      .post("/settings/stream_key")
      .then((res) => {
        setStreamKey(res.data.stream_key);
      })
      .catch((error) => {
        console.log("There was an error generating stream key. " + error);
      });
  }

  function getStreamKey() {
    axios
      .get("/settings/stream_key")
      .then((res) => {
        setStreamKey(res.data.stream_key);
      })
      .catch((error) => {
        console.log("There was an error getting the stream key. " + error);
      });
  }

  function handleLogout(e) {
    axios.get("/logout").then((res) => {
      if (res.status === 200) {
        history.push("/");
        window.location.reload(true);
      }
    });
  }
  const navigateToLiveBroadcast = () => {
    history.push(`/livebroadcast`);
  };
  return (
    <React.Fragment>
      <div className="container mt-5 text-white">
        <h4>Logged user:</h4>
        <div className="row">
          <h5>
            {loggedUser ? loggedUser.email : "Could not get logged user."}
          </h5>
        </div>
        <h4>Streaming Key:</h4>

        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
          <div className="row">
            <h5>{streamKey ? streamKey : "No stream key found."}</h5>
          </div>
          <div className="row">
            {loggedUser ? (
              <button
                className={clsx(settingStyle.button, "mt-2")}
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              ""
            )}
            <button
              className={clsx(settingStyle.button, "mt-2")}
              onClick={generateStreamKey}
            >
              Generate a new key
            </button>
            <button
              className={clsx(settingStyle.button, "mt-2")}
              onClick={navigateToLiveBroadcast}
            >
              Start Live Broadcast
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-5 text-white">
        <h4>How to Stream</h4>
        <hr className="my-4" />

        <div className="col-12">
          <div className="row">
            <p>
              You can use{" "}
              <a target="_blank" href="https://obsproject.com/">
                OBS
              </a>{" "}
              or
              <a target="_blank" href="https://www.xsplit.com/">
                XSplit
              </a>{" "}
              to Live stream. If you're using OBS, go to Settings > Stream and
              select Custom from service dropdown. Enter
              <b>rtmp://127.0.0.1:1935/live</b> in server input field. Also, add
              your stream key. Click apply to save.
              <br />
              You can also stream from this page by opening it on Chrome on your
              phone (or PC) and clicking Start Live Broadcast.
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
