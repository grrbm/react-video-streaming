const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema").User,
  axios = require("axios"),
  config = require("../config/default"),
  port = config.rtmp_server.http.port;

const environment = process.env.NODE_ENV;
let baseUrl;
if (environment === "production") {
  //if it's in production
  baseUrl = "http://localhost";
} else {
  baseUrl = "http://127.0.0.1";
}

router.get("/info", (req, res) => {
  if (req.query.streams) {
    let streams = JSON.parse(req.query.streams);
    let query = { $or: [] };
    for (let stream in streams) {
      if (!streams.hasOwnProperty(stream)) continue;
      query.$or.push({ stream_key: stream });
    }

    User.find(query, (err, users) => {
      if (err) return;
      if (users) {
        res.json(users);
      }
    });
  }
});

router.get("/listAllStreams", async (req, res) => {
  try {
    let fullUrl = `${baseUrl}:` + port + "/api/streams";
    fullUrl = fullUrl.replace(/https/, "http");
    const result = await axios.get(fullUrl);
    res.status(200).send(result.data);
  } catch (error) {
    const errorMsg = "Error getting list of streams available. Error: " + error;
    console.log(errorMsg);
    res.status(500).send(errorMsg);
  }
});

router.get("/watchStream/:streamKey", async (req, res) => {
  const streamKey = req.params.streamKey;
  try {
    let fullUrl = `${baseUrl}:` + port + "/live/" + streamKey + "/index.m3u8";
    fullUrl = fullUrl.replace(/https/, "http");
    const result = await axios.get(fullUrl);
    res.status(200).send(result.data);
  } catch (error) {
    const errorMsg = "Error trying to get a watchable stream. Error: " + error;
    console.log(errorMsg);
    res.status(500).send(errorMsg);
  }
});

module.exports = router;
