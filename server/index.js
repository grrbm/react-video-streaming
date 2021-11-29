const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  extractFrames = require("ffmpeg-extract-frames"),
  { v4: uuidv4 } = require("uuid"),
  ffmpeg = require("fluent-ffmpeg"),
  app = express(),
  fs = require("fs"),
  config = require("config"),
  db = config.get("mongodbURL"),
  Video = require("./models/Video"),
  bodyParser = require("body-parser"),
  path = require("path"),
  crypto = require("crypto"),
  multer = require("multer"),
  Grid = require("gridfs-stream"),
  { GridFsStorage } = require("multer-gridfs-storage"),
  FormData = require("form-data"),
  axios = require("axios"),
  mongodb = require("mongodb"),
  node_media_server = require("./media_server"),
  passport = require("./auth/passport");

require("dotenv").config();
const mongoURI = process.env.MONGODB_URI || db;

app.use(cors());

/** Add imported routes **/
app.use("/streams", require("./routes/streams"));

app.get("/video/all", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.log("error fetching all videos: " + error);
    res.status(500).end();
  }
});

/* Set EJS */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

/* Add login/register routes */
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));

/* Passport Initialization */

app.use(passport.initialize());
app.use(passport.session());

//Find video by file name
app.get("/video/:name", async (req, res) => {
  try {
    const video = await Video.findOne({ name: req.params.name });
    res.json(video);
  } catch (error) {
    console.log("Error finding video by name: " + error);
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
      console.log("Posting video information: " + req.body.videoInformation);
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
  .connect(mongoURI, {
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
  url: mongoURI,
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

  mongodb.MongoClient.connect(mongoURI, function (error, client) {
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
          console.log(`No video with name ${req.file.filename} exists !`);
          res
            .status(404)
            .send(`No video with name ${req.file.filename} exists !`);
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
  });
});

app.get("/mongo-video/:filename", function (req, res) {
  mongodb.MongoClient.connect(mongoURI, function (error, client) {
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
      { filename: req.params.filename },
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
          req.params.filename,
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
node_media_server.run();
