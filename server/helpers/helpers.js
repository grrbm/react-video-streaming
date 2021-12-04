const spawn = require("child_process").spawn,
  config = require("../config/default"),
  cmd = config.rtmp_server.trans.ffmpeg;

const baseUrl = process.env.HOST || "127.0.0.1";
const generateStreamThumbnail = (stream_key) => {
  const args = [
    "-y",
    "-i",
    `http://${baseUrl}:8888/live/` + stream_key + "/index.m3u8",
    "-ss",
    "00:00:01",
    "-vframes",
    "1",
    "-vf",
    "scale=-2:300",
    "thumbnails/" + stream_key + ".png",
  ];
  spawn(cmd, args, {
    /* The following is the only configuration that works without spawning
    a cmd window every 3 seconds. Check out the comment by BrianHVB here:
    https://github.com/nodejs/node/issues/21825
    previously it was:  
        detached: true,
        stdio: 'ignore'
    */
    detached: false, // wtf?
    shell: true, // also wtf?
    windowsHide: false,
  }).unref();
};

module.exports = {
  generateStreamThumbnail: generateStreamThumbnail,
};
