require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  extractFrames = require("ffmpeg-extract-frames"),
  { v4: uuidv4 } = require("uuid"),
  ffmpeg = require("fluent-ffmpeg"),
  app = express(),
  app2 = express(),
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
  thumbnail_generator = require("./cron/thumbnails"),
  passport = require("./auth/passport"),
  session = require("express-session"),
  flash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  spawn = require("child_process").spawn;

const mongoURI = process.env.MONGODB_URI || db;

/* Setup broadcast live */

//set CORS in server 2
app2.use(cors());
//Serve "static" folder on Server 2
app2.use("/static", express.static(path.join(__dirname, "./static")));

//create http server
var http = require("http").Server(app2);

//create https server
// const server = require("https").createServer(
//   {
//     key: fs.readFileSync("certificates/grrbm-key.pem"),
//     cert: fs.readFileSync("certificates/grrbm-cert.pem"),
//   },
//   app2
// );
console.log("THIS IS NODE_ENV: " + process.env.NODE_ENV);
let originUrl;
if (process.env.NODE_ENV === "production") {
  originUrl = config.productionUrl;
} else {
  originUrl = "http://localhost:3000";
}
//make socket io use this server
var io = require("socket.io")(http, {
  cors: {
    origin: originUrl,
    methods: ["GET", "POST"],
  },
});
//spawn ffmpeg
spawn("ffmpeg", ["-h"]).on("error", function (m) {
  console.error(
    "FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!"
  );
  process.exit(-1);
});

//on connection event:
io.on("connection", function (socket) {
  socket.emit("message", "Hello from mediarecorder-to-rtmp server!");
  socket.emit("message", "Please set rtmp destination before start streaming.");

  var ffmpeg_process,
    feedStream = false;
  socket.on("config_rtmpDestination", function (m) {
    if (typeof m != "string") {
      socket.emit("fatal", "rtmp destination setup error.");
      return;
    }
    var regexValidator = /^rtmp:\/\/[^\s]*$/; //TODO: should read config
    if (!regexValidator.test(m)) {
      socket.emit("fatal", "rtmp address rejected.");
      return;
    }
    socket._rtmpDestination = m;
    socket.emit("message", "rtmp destination set to:" + m);
  });
  //socket._vcodec='libvpx';//from firefox default encoder
  socket.on("config_vcodec", function (m) {
    if (typeof m != "string") {
      socket.emit("fatal", "input codec setup error.");
      return;
    }
    if (!/^[0-9a-z]{2,}$/.test(m)) {
      socket.emit("fatal", "input codec contains illegal character?.");
      return;
    } //for safety
    socket._vcodec = m;
  });

  socket.on("start", function (m) {
    if (ffmpeg_process || feedStream) {
      socket.emit("fatal", "stream already started.");
      return;
    }
    if (!socket._rtmpDestination) {
      socket.emit("fatal", "no destination given.");
      return;
    }

    var ops = [
      "-i",
      "-",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-tune",
      "zerolatency", // video codec config: low latency, adaptive bitrate
      "-c:a",
      "aac",
      "-ar",
      "44100",
      "-b:a",
      "64k", // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
      "-y", //force to overwrite
      "-use_wallclock_as_timestamps",
      "1", // used for audio sync
      "-async",
      "1", // used for audio sync
      //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
      //'-strict', 'experimental',
      "-bufsize",
      "1000",
      "-f",
      "flv",
      socket._rtmpDestination,
    ];

    console.log(socket._rtmpDestination);
    ffmpeg_process = spawn("ffmpeg", ops);
    feedStream = function (data) {
      ffmpeg_process.stdin.write(data);
      //write exception cannot be caught here.
    };

    ffmpeg_process.stderr.on("data", function (d) {
      socket.emit("ffmpeg_stderr", "" + d);
    });
    ffmpeg_process.on("error", function (e) {
      console.log("child process error" + e);
      socket.emit("fatal", "ffmpeg error!" + e);
      feedStream = false;
      socket.disconnect();
    });
    ffmpeg_process.on("exit", function (e) {
      console.log("child process exit" + e);
      socket.emit("fatal", "ffmpeg exit!" + e);
      socket.disconnect();
    });
  });

  socket.on("binarystream", function (m) {
    if (!feedStream) {
      socket.emit("fatal", "rtmp not set yet.");
      ffmpeg_process.stdin.end();
      ffmpeg_process.kill("SIGINT");
      return;
    }
    feedStream(m);
  });
  socket.on("disconnect", function (reason) {
    console.log("Server disconnected. Reason: " + reason);
    feedStream = false;
    if (ffmpeg_process)
      try {
        ffmpeg_process.stdin.end();
        ffmpeg_process.kill("SIGINT");
      } catch (e) {
        console.warn("killing ffmoeg process attempt failed...");
      }
  });
  socket.on("error", function (e) {
    console.log("socket.io error:" + e);
  });
});
//on error event
io.on("error", function (e) {
  console.log("socket.io error:" + e);
});

//listen on port 8887
http.listen(8887, function () {
  console.log("http and websocket listening on *:8887");
});

//listen on port 444
// server.listen(444, function () {
//   console.log("https and websocket listening on *:444");
// });

//catch process exceptions
process.on("uncaughtException", function (err) {
  // handle the error safely
  console.log(err);
  // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
});

/* END setup broadcast live */

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser("secretcode"));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
/* Setup flash and cookie-parser */
app.use(flash({ locals: "flash" }));

/* Passport Initialization 
ATTENTION: PASSPORT MUST BE INITIALIZED BEFORE ANY ROUTES */

app.use(passport.initialize());
app.use(passport.session());

/** Add imported routes **/
app.use("/streams", require("./routes/streams"));
app.use("/certificate", require("./routes/certificate"));

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
app.use("/settings", require("./routes/settings"));
app.use("/user", require("./routes/user"));

/* Login route with EJS */
app.get("/login", function (req, res) {
  res.render("login", { message: req.flash("message") });
});

app.get("/loggedUser", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/logout", function (req, res) {
  req.logout();
  res.status(200).send("Logout successful");
});

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
//Serve the "media" folder
app.use(express.static(__dirname + "/media"));
//Serve "videos" folder
app.use("/video", express.static("videos"));
//Serve "thumbnails" folder
app.use("/thumbnails", express.static("thumbnails"));
//Server "static" folder
app.use("/static", express.static(path.join(__dirname, "./static")));

app.listen(port, () => console.log("Server Started..."));
node_media_server.run();
thumbnail_generator.start();
