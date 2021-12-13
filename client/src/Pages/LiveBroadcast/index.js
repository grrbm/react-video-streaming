import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import config from "../../config/default";
import "./LiveBroadcast.scss";
const { io } = require("socket.io-client");
const fs = require("fs");

const LiveBroadcast = ({ location }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [streamKey, setStreamKey] = useState("");
  const [state, setState] = useState("stop");
  const [streamInitialized, setStreamInitialized] = useState(false);
  const socket = useRef();

  useEffect(() => {
    if (loggedUser) {
      getStreamKey();
    }
  }, [loggedUser]);

  useEffect(() => {
    const getLoggedUser = async () => {
      try {
        const result = await Axios.get("/loggedUser");
        setLoggedUser(result.data);
      } catch (error) {
        console.log("Could not get logged user. " + error);
      }
    };
    getLoggedUser();
  }, []);

  function getStreamKey() {
    Axios.get("/settings/stream_key")
      .then((res) => {
        setStreamKey(res.data.stream_key);
      })
      .catch((error) => {
        console.log("There was an error getting the stream key. " + error);
      });
  }

  var flvPlayer;
  var flvsource = useRef();

  const output_console = useRef(),
    output_message = useRef(),
    output_video = useRef(),
    option_url = useRef(),
    socketio_address = useRef(),
    option_width = useRef(),
    option_height = useRef(),
    button_start = useRef(),
    button_server = useRef();

  var mediaRecorder;
  //var state = "stop";
  var t;
  useEffect(() => {
    if (flvsource.current) {
      //flvsourceinitialize();
    }
    if (button_start.current) {
      button_start.current.disabled = true;
    }
    if (option_height.current) {
      // var height = option_height.current.value,
      //   width = option_width.current.value,
      //   url = (option_url.current.value =
      //     "rtmp://" + location.host.split(":")[0] + ":1935/live/${streamKey}");
      // var t;
    }
  }, []);
  async function asyncRequestMedia() {
    const res = await requestMedia();
    return res;
  }
  useEffect(() => {
    if (state === "ready") {
      asyncRequestMedia();
    }
    // if (state === "stop") {
    //   var oo = document.getElementById("checkbox_Reconection");
    //   if (oo.checked) {
    //     timedCount();
    //     output_message.current.innerHTML = "server is reload!";
    //     //如果該checkbox有勾選應作的動作...
    //   }
    // }
  }, [state]);

  function fail(str) {
    alert(str + "\nPlease download the latest version of Firefox!");
    //location.replace("http://mozilla.org/firefox");
  }

  function flvsourceinitialize() {
    try {
      if (window.flvjs.isSupported()) {
        var videoElement = document.getElementById("videoElement");
        flvPlayer = window.flvjs.createPlayer({
          type: "flv",
          url: flvsource.current.value,
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        var media = document.getElementById("videoElement");
        //This onerror function only works on CHROME
        media.onerror = function () {
          console.log(
            "Error " + media.error.code + "; details: " + media.error.message
          );
        };
        const playPromise = media.play();
        if (playPromise !== null) {
          playPromise.catch(() => {
            media.play();
          });
          output_message.current.innerHTML = "change flvsource successful!";
        }
      }
    } catch (error) {
      console.log("There as an error initializing flv: " + error);
    }
  }
  async function connect_server() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.webkitGetUserMedia;
    if (!navigator.getUserMedia) {
      fail("No getUserMedia() available.");
    }
    if (!MediaRecorder) {
      fail("No MediaRecorder available.");
    }
    const result = await Axios.get("/certificate");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // const fullUrl =
    //   window.location.protocol + window.location.hostname + config.socketioPort;
    const fullUrl = socketio_address.current.value;
    if (process.env.NODE_ENV === "production") {
      socket.current = io.connect(fullUrl, {
        secure: true,
        ca: result.data.fullchain,
      });
    } else {
      console.log("connecting to fullUrl: " + fullUrl);
      socket.current = io.connect(fullUrl);
    }

    socket.current.on("connect", function (m) {
      console.log("Got back connect event from backend. " + m);
      show_output("Got back connect event from backend. " + m);
      setState("ready");
    });
    socket.current.on("connect_error", function (error) {
      console.log("Connection Failed: " + error.code + " : " + error.message);
      output_message.current.innerHTML =
        "Connection Failed: " + error.code + " : " + error.message;
    });
    socket.current.on("message", function (m) {
      console.log("recv server message", m);
      show_output("SERVER:" + m);
    });
    socket.current.on("finishedSettingRtmp", function (m) {
      show_output("finishedSettingRtmp event caught successfully.");
    });
    socket.current.on("fatal", function (m) {
      show_output("ERROR: unexpected:" + m);
      //alert('Error:'+m);
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      setState("stop");
      //state = "stop";
      button_start.current.disabled = true;
      button_server.current.disabled = false;
      //should reload?
    });
    socket.current.on("ffmpeg_stderr", function (m) {
      show_output("FFMPEG:" + m);
    });
    socket.current.on("disconnect", function (reason) {
      show_output("ERROR: server disconnected! Reason: " + reason);
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      setState("stop");
      //state = "stop";
      button_start.current.disabled = true;
      button_server.current.disabled = false;
      //	document.getElementById('button_start').disabled=true;
      var oo = document.getElementById("checkbox_Reconection");
      if (oo.checked) {
        //timedCount();
        connect_server();

        output_message.current.innerHTML = "server is reload!";
        //如果該checkbox有勾選應作的動作...
      }
    });

    //state = "ready";
    button_start.current.disabled = false;
    button_server.current.disabled = true;
    output_message.current.innerHTML = "connect server successful";
  }
  function timedCount() {
    var oo = document.getElementById("checkbox_Reconection");
    if (oo.checked) {
      if (state == "ready") {
        requestMedia();
        button_start.current.disabled = false;
        button_server.current.disabled = true;
      } else {
        t = setTimeout(timedCount, 1000);
        connect_server();
        output_message.current.innerHTML = "try connect server ...";
        button_start.current.disabled = true;
        button_server.current.disabled = false;
      }
    } else {
      button_start.current.disabled = true;
      button_server.current.disabled = false;
    }
  }

  function requestMedia() {
    /*this wrapper is needed so external variables (eg. socket)
    can be used inside the promise.*/
    return new Promise((resolve, reject) => {
      if (!loggedUser) {
        output_message.current.innerHTML = "User is not logged in";
        reject("User is not logged in");
      }
      if (!streamKey) {
        output_message.current.innerHTML = "User doesn't have a streaming key";
        console.log("User doesn't have a streaming key");
        reject("User doesn't have a streaming key");
      }
      var constraints = {
        audio: true,
        video: {
          width: {
            min: option_width.current.value,
            ideal: option_width.current.value,
            max: option_width.current.value,
          },
          height: {
            min: option_height.current.value,
            ideal: option_height.current.value,
            max: option_height.current.value,
          },
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          video_show(stream); //only show locally, not remotely

          /* Getting URL here locally */
          var url = (option_url.current.value =
            "rtmp://" + window.location.hostname + `:1935/live/${streamKey}`);
          console.log("This is the RTMP url: " + url);

          socket.current.emit("config_rtmpDestination", url);
          socket.current.emit("start", "start");
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start(0);

          mediaRecorder.onstop = function (e) {
            if (stream) {
              stream.getVideoTracks()[0].stop();
            }
          };
          //document.getElementById('button_start').disabled=false;

          mediaRecorder.ondataavailable = function (e) {
            socket.current.emit("binarystream", e.data);
            setState("start");
            resolve("Stream has started.");
            //state = "start";
            //chunks.push(e.data);
          };
        })
        .catch(function (err) {
          console.log("The following error occured: " + err);
          show_output("Local getUserMedia ERROR:" + err);
          output_message.current.innerHTML =
            "Local video source size is not supported or No camera ?" +
            output_video.current.videoWidth +
            "x" +
            output_video.current.videoHeight;
          setState("stop");
          reject("Local video source size is not supported or No camera ?");
          button_start.current.disabled = true;
          button_server.current.disabled = false;
        });
    });
  }
  function video_show(stream) {
    if ("srcObject" in output_video.current) {
      output_video.current.srcObject = stream;
    } else {
      output_video.current.src = window.URL.createObjectURL(stream);
    }
    output_video.current.addEventListener(
      "loadedmetadata",
      function (e) {
        output_message.current.innerHTML =
          "Local video source size:" +
          output_video.current.videoWidth +
          "x" +
          output_video.current.videoHeight;
      },
      false
    );
  }
  function show_output(str) {
    output_console.current.value += "\n" + str;
    //get only the last 500 characters
    output_console.current.value = output_console.current.value.slice(-10000);
    output_console.current.scrollTop = output_console.current.scrollHeight;
  }
  return (
    <div className="mainDiv">
      <h1>MediaRecorder to RTMP Demo</h1>
      <h4>Streaming Key:</h4>
      <h5>{streamKey ? streamKey : "No stream key found."}</h5>
      <label for="option_width">Size:</label>
      <input
        type="text"
        id="option_width"
        ref={option_width}
        value="640"
      />{" "}
      &times;
      <input type="text" id="option_height" ref={option_height} value="480" />
      <br />
      <label for="socket.io_url">Socket.io Destination:</label>
      <input
        type="text"
        id="socket.io_address"
        ref={socketio_address}
        value={
          process.env.NODE_ENV === "production"
            ? config.productionUrl + `:${config.prodSocketioPort}`
            : `${config.localUrl}:${config.localSocketioPort}`
        }
      />
      <br />
      <label for="flv_url">flv_source Destination:</label>
      <input
        type="text"
        id="flvsource"
        ref={flvsource}
        value={
          process.env.NODE_ENV === "production"
            ? config.productionUrl +
              `:${config.prodSocketioPort}/live/test0.flv`
            : `${config.localUrl}:${config.localSocketioPort}/live/test0.flv`
        }
      />
      <br />
      <label for="option_url">RTMP Destination:</label>
      <input
        type="text"
        id="option_url"
        ref={option_url}
        value={`rtmp://${window.location.hostname}/live/${streamKey}`}
      />
      <label for="checkbox_Reconection">Reconnection</label>
      <input type="checkbox" id="checkbox_Reconection" checked="true" />
      <br />
      <button id="button_server" ref={button_server} onClick={connect_server}>
        Connect_server
      </button>
      <button
        style={{ display: "none" }}
        id="button_start"
        ref={button_start}
        onClick={requestMedia}
      >
        Start streaming
      </button>
      {/*<button id="button_setflvsource">Set flvsource</button>*/}
      <hr />
      <div>
        <p id="output_message" ref={output_message}></p>

        <video id="output_video" ref={output_video} autoplay="true"></video>
        <video id="videoElement" preload="none"></video>
      </div>
      <hr />
      <textarea
        readonly="true"
        id="output_console"
        ref={output_console}
        cols="91"
        rows="5"
      ></textarea>
    </div>
  );
};

export default LiveBroadcast;
