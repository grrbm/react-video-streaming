const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const extractFrames = require("ffmpeg-extract-frames");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const app = express();
const fs = require("fs");
const config = require("config");
const db = config.get("mongodbURL");
const Video = require("./models/Video");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const FormData = require("form-data");
const axios = require("axios");
const mongodb = require("mongodb");
require("dotenv").config();

app.use(cors());

app.get("/video/all", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});
//Find video by file name
app.get("/video/:name", async (req, res) => {
  try {
    const video = await Video.findOne({ name: req.params.name });
    res.json(video);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

app.use(bodyParser.json());
app.post("/videoinformation", (req, res) => {
  Video.findById(req.body.videoId, function (err, video) {
    if (!video) res.status(400).send("can't find video");
    else {
      video.group = req.body.group;
      video.videoinformation = req.body.videoInformation;
      console.log(req.body.videoInformation);
      video
        .save()
        .then((video) => {
          res.json(video);
        })
        .catch((err) => {
          res.status(400).send("Unable To Update video");
        });
    }
  });
});

/*  Connecting via Mongoose   */
mongoose
  .connect(process.env.MONGODB_URI || db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

/*   GridFS Stream Configuration */
let gfs;
mongoose.connection.once("open", () => {
  //Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  //name of the bucket where media is going to be retrieved
  gfs.collection("media");
});

/*   Create Storage Engine    */
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "media",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage: storage, preservePath: true });

/*    Route to upload a File   */
app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  (req, res) => {
    if (!req.file) {
      res.status(500).send("Must upload a file !");
    }
    console.log("got here");
    const response = { file: req.file };
    res.json(response);
  }
);

app.get("/files", async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();

    res.json(files);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.post("/video", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  console.log("Uploading Started...");
  gfs.exist(
    { filename: "37ce67576e4646cfbbee429a2a150670.mp4" },
    function (err, found) {
      if (err) return handleError(err);
      found ? console.log("File exists") : console.log("File does not exist");
      res.send(found);
    }
  );

  mongodb.MongoClient.connect(
    process.env.MONGODB_URI || db,
    function (error, client) {
      if (error) {
        res.status(500).json(error);
        return;
      }
      const db = client.db("ReactVideoStreaming");
      // GridFS Collection
      db.collection("media.files").findOne(
        { filename: req.file.filename },
        (err, video) => {
          if (!video) {
            res.status(404).send(`No video with name ${filename} exists !`);
            return;
          }
          //--------------------------------------------------------------------
          // streaming from gridfs
          var readstream = gfs.createReadStream({
            filename: req.file.filename,
          });

          //error handling, e.g. file does not exist
          readstream.on("error", function (err) {
            console.log("An error occurred!", err);
            throw err;
          });
          try {
            const conv = new ffmpeg({
              source: readstream,
            }).addOptions([
              "-profile:v baseline",
              "-level 3.0",
              "-s 1280x720",
              "-hls_time 10",
              "-hls_list_size 0",
              "-f hls",
            ]);
            conv
              .setStartTime(2) //Can be in "HH:MM:SS" format also
              .setDuration(10)
              .on("start", function (commandLine) {
                console.log("Spawned FFmpeg with command: " + commandLine);
              })
              .on("error", function (err) {
                console.log("error: ", err);
              })
              .output("video")
              .on("end", function (err) {
                if (!err) {
                  console.log("conversion Done");
                  extractFrames({
                    input: "video",
                    output: "thumbnails/frame.jpg",
                    offsets: [1000],
                  }).then(async (result) => {
                    let newVideo = new Video({ name: req.file.filename });
                    var imageData = fs.readFileSync(result);
                    newVideo.videoThumbnail = imageData;
                    newVideo
                      .save()
                      .then((video) => {
                        console.log("Uploaded successfully");
                        res.json(video);
                      })
                      .catch((err) => {
                        console.log("There was an error here: " + err);
                        res.status(500).end();
                      });
                  });
                }
              })
              .run();
          } catch (error) {
            console.log("Error with ffmpeg. " + error);
          }
        }
      );
    }
  );
});

/*   Setting Port  */
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "/../client/build")));
} else {
  app.use(express.static(path.join(__dirname, "/../client/src")));
}
//Always serve "public" folder (for testing purposes)
app.use(express.static(__dirname + "/public"));
//Serve "videos" folder
app.use("/video", express.static("videos"));

app.listen(port, () => console.log("Server Started..."));
