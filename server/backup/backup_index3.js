const express = require("express");
const app = express();
const fs = require("fs");
const mongodb = require("mongodb");
const config = require("config");
const url = config.get("mongodbURL");
//const url = "mongodb://user:password@db:27017";

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Sorry about this monstrosity
app.get("/init-video", function (req, res) {
  mongodb.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
      return;
    }
    const db = client.db("videos");
    const bucket = new mongodb.GridFSBucket(db, { bucketName: "media" });
    const videoUploadStream = bucket.openUploadStream("bigbuck");
    const videoReadStream = fs.createReadStream("./bigbuck.mp4");
    videoReadStream.pipe(videoUploadStream);
    res.status(200).send("Done...");
  });
});

app.get("/mongo-video", function (req, res) {
  mongodb.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.status(500).json(error);
      return;
    }

    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }

    const db = client.db("ReactVideoStreaming");
    db.collection("media.files")
      .find({})
      .toArray(function (err, results) {
        console.log("got the results;");
      });
    // GridFS Collection
    db.collection("media.files").findOne(
      { filename: "37ce67576e4646cfbbee429a2a150670.mp4" },
      (err, video) => {
        if (!video) {
          res.status(404).send("No video uploaded!");
          return;
        }

        // Create response headers
        const videoSize = video.length;
        const start = Number(range.replace(/\D/g, ""));
        const end = videoSize - 1;

        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        const bucket = new mongodb.GridFSBucket(db, { bucketName: "media" });
        const downloadStream = bucket.openDownloadStreamByName(
          "37ce67576e4646cfbbee429a2a150670.mp4",
          {
            start,
          }
        );

        // Finally pipe video to response
        downloadStream.pipe(res);
      }
    );
  });
});

//Always serve "public" folder (for testing purposes)
app.use(express.static(__dirname + "/public"));

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
