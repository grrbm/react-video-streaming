const config = {
  mongodbURL: "mongodb://localhost:27017/ReactVideoStreaming",
  secret_token: "1b671a64-40d5-491e-99b0-da01ff1f3341",
  productionUrl: "https://loud-now.cyou",
  localUrl: "http://localhost",
  prodSocketioPort: 444,
  localSocketioPort: 8887,
  server: {
    secret: "ASOlojaga812imsxaofdApldgosfmcv891kKSkdf",
    port: 3333,
  },
  rtmp_server: {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 3000,
    },
    http: {
      port: 8888,
      mediaroot: "./media",
      allow_origin: "*",
    },
    https: {
      port: 8443,
    },
    trans: {
      ffmpeg:
        process.env.FFMPEG_PATH || "C:/ProgramData/chocolatey/bin/ffmpeg.exe",
      tasks: [
        {
          app: "live",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        },
      ],
    },
  },
};
module.exports = config;
