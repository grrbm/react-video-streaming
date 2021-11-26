var express = require("express");
const mongoose = require("mongoose");
var multer = require("multer");
var path = require("path");
const config = require("config");
const db = config.get("mongodbURL");
const fileUpload = require("express-fileupload");

/*   Setting Port  */
const port = process.env.PORT || 5000;

let connectURI = process.env.MONGODB_URI || db;

/*  Connecting via Mongoose   */
mongoose
  .connect(connectURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

//app.use(fileUpload());

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    response += `<img src="${req.file.path}" /><br>`;
    return res.send(response);
  }
);

app.post(
  "/profile-upload-multiple",
  upload.array("profile-files", 12),
  function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    for (var i = 0; i < req.files.length; i++) {
      response += `<img src="${req.files[i].path}" /><br>`;
    }

    return res.send(response);
  }
);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "/../client/build")));
} else {
  app.use(express.static(path.join(__dirname, "/../client/src")));
}

app.listen(port, () =>
  console.log(
    `Server running on port ${port}!\nClick http://localhost:${port}/`
  )
);
