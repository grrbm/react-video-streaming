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
    <div className="mainDiv poppins-medium">
      <div className="container mx-auto pt-5 text-white">
        <div
          className={clsx(
            settingStyle.modalContainer,
            "flex text-center text-justify mx-auto w-96 h-96 sm:w-3/5 sm:h-3/5 max-w-6xl"
          )}
        >
          <div className={clsx(settingStyle.title, "w-full p-4 poppins-bold")}>
            <div>My Account</div>
          </div>
          <div
            className={clsx(
              settingStyle.body,
              "flex flex-row flex-start flex-wrap mt-12"
            )}
          >
            <div className="inputElement flex flex-col items-start">
              <label>Username</label>
              <input
                type="text"
                id="name"
                value={loggedUser ? loggedUser.username : "-"}
                disabled
              />
            </div>

            {/* <div className="inputElement flex flex-col items-start">
              <label for="option_width">Last Name</label>
              <input type="text" id="option_width" value="Marques" disabled />
            </div> */}
            <div className="inputElement flex flex-col items-start">
              <label for="option_width">Email</label>
              <input
                type="text"
                id="option_width"
                value={loggedUser ? loggedUser.email : "-"}
                disabled
              />
            </div>
            <div className="inputElement flex flex-col items-start">
              <label for="option_width">Streaming Key</label>
              <input
                type="text"
                id="option_width"
                value={streamKey ? streamKey : "-"}
                disabled
              />
            </div>
          </div>
          <div className="footer container mx-auto flex flex-col items-center justify-items-center">
            <div className="mt-4">
              <button
                className={clsx(settingStyle.altButton, "mt-2")}
                onClick={generateStreamKey}
              >
                Generate a new key
              </button>
              <button
                className={clsx(settingStyle.altButton, "mt-2")}
                onClick={navigateToLiveBroadcast}
              >
                Start Live Broadcast
              </button>
            </div>
            <button
              className="mb-12 poppins-medium text-lg mt-4 w-5/6 mr-0 ml-0"
              onClick={handleLogout}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
