const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema").User,
  axios = require("axios");

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
    const result = axios.get(fullUrl);
    res.status(200).send(result.data);
  } catch (error) {
    res.status(500).send("Error getting list of streams available.");
  }
});

module.exports = router;
