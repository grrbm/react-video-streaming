import React, { useEffect, useRef } from "react";
import { useScript } from "../../Hooks/useScript";
import Script from "react-inline-script";
import { Helmet } from "react-helmet";
//import socketClient from "socket.io-client";
import "./LiveBroadcast.scss";
const { io } = require("socket.io-client");

const SERVER = "http://127.0.0.1:5000";
const LiveBroadcast = ({ location }) => {
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

  var socket;
  var mediaRecorder;
  var state = "stop";
  useEffect(() => {
    flvsourceinitialize();
    if (option_height.current) {
      var height = option_height.current.value,
        width = option_width.current.value,
        url = (option_url.current.value =
          "rtmp://" + location.host.split(":")[0] + ":1935/live/5ikZe6zL4");
      var t;
    }
  }, []);

  function fail(str) {
    alert(str + "\nPlease download the latest version of Firefox!");
    location.replace("http://mozilla.org/firefox");
  }

  function flvsourceinitialize() {
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
      const playPromise = media.play();
      if (playPromise !== null) {
        playPromise.catch(() => {
          media.play();
        });
        output_message.current.innerHTML = "change flvsource successful!";
      }
    }
  }

  function requestMedia() {
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
          "rtmp://" + location.host.split(":")[0] + ":1935/live/5ikZe6zL4");

        socket.emit("config_rtmpDestination", url);
        socket.emit("start", "start");
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(0);

        mediaRecorder.onstop = function (e) {
          stream.stop();
        };
        //document.getElementById('button_start').disabled=false;

        mediaRecorder.ondataavailable = function (e) {
          socket.emit("binarystream", e.data);
          state = "start";
          //chunks.push(e.data);
        };
      })
      .catch(function (err) {
        console.log("The following error occured: " + err);
        show_output("Local getUserMedia ERROR:" + err);
        output_message.innerHTML =
          "Local video source size is not soupport or No camera ?" +
          output_video.videoWidth +
          "x" +
          output_video.videoHeight;
        state = "stop";
        button_start.disabled = true;
        button_server.disabled = false;
      });
  }
  function video_show(stream) {
    if ("srcObject" in output_video) {
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
    output_console.value += "\n" + str;
    output_console.scrollTop = output_console.scrollHeight;
  }
  return (
    <div className="mainDiv">
      <Helmet>
        <script src="/clientstatic/flv.min.js"></script>
      </Helmet>
      <h1>MediaRecorder to RTMP Demo</h1>
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
        value="https://165.232.159.222:444"
      />
      <br />
      <label for="flv_url">flv_soruce Destination:</label>
      <input
        type="text"
        id="flvsource"
        ref={flvsource}
        value="https://165.232.159.222:444/live/test0.flv"
      />
      <br />
      <label for="option_url">RTMP Destination:</label>
      <input
        type="text"
        id="option_url"
        ref={option_url}
        value="rtmp://165.232.159.222/live/5ikZe6zL4"
      />
      <label for="checkbox_Reconection">Reconnection</label>
      <input type="checkbox" id="checkbox_Reconection" checked="true" />
      <br />
      <button id="button_server">Connect_server</button>
      <button id="button_start" ref={button_start} onClick={requestMedia}>
        Start streaming
      </button>
      <button id="button_setflvsource">Set flvsource</button>
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
