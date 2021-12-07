import React from "react";
import { useScript } from "../../Hooks/useScript";
import "./LiveBroadcast.scss";

const LiveBroadcast = () => {
  useScript("flv.min.js");
  useScript("/socket.io/socket.io.js");

  return (
    <div className="mainDiv">
      <h1>MediaRecorder to RTMP Demo</h1>
      <label for="option_width">Size:</label>
      <input type="text" id="option_width" value="640" /> &times;
      <input type="text" id="option_height" value="480" />
      <br />
      <label for="socket.io_url">Socket.io Destination:</label>
      <input
        type="text"
        id="socket.io_address"
        value="https://165.232.159.222:444"
      />
      <br />
      <label for="flv_url">flv_soruce Destination:</label>
      <input
        type="text"
        id="flvsource"
        value="https://165.232.159.222:444/live/test0.flv"
      />
      <br />
      <label for="option_url">RTMP Destination:</label>
      <input
        type="text"
        id="option_url"
        value="rtmp://165.232.159.222/live/5ikZe6zL4"
      />
      <label for="checkbox_Reconection">Reconnection</label>
      <input type="checkbox" id="checkbox_Reconection" checked="true" />
      <br />
      <button id="button_server">Connect_server</button>
      <button id="button_start">Start streaming</button>
      <button id="button_setflvsource">Set flvsource</button>
      <hr />
      <div>
        <p id="output_message"></p>

        <video id="output_video" autoplay="true"></video>
        <video id="videoElement" preload="none"></video>
      </div>
      <hr />
      <textarea
        readonly="true"
        id="output_console"
        cols="91"
        rows="5"
      ></textarea>
    </div>
  );
};

export default LiveBroadcast;
