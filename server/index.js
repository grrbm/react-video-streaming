const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const extractFrames = require('ffmpeg-extract-frames');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const fs = require('fs');
const db = config.get('mongodbURL');
const Video = require('./models/Video');

app.use(fileUpload());
app.use(cors());
app.post('/video', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  console.log('Uploading Started...');
  const uuid = uuidv4();
  const file = req.files.file;
  const folder = `${__dirname}/videos/${uuid}`;
  fs.mkdirSync(folder);
  const path = `${folder}/video`;
  file.mv(path, err => {
    if (err) {
      console.error(err);
      return res.status(500);
    }
    ffmpeg(path, { timeout: 4320 })
      .addOptions([
        '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
        '-level 3.0',
        '-s 1280x720', // 1280px width, 720px height output video dimensions
        '-start_number 0', // start the first .ts segment at index 0
        '-hls_time 10', // 10 second segment duration
        '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
        '-f hls', // HLS format
      ])
      .output(`${folder}/video.m3u8`)
      .on('end', () => {
        extractFrames({
          input: `${folder}/video`,
          output: `${folder}/frame.jpg`,
          offsets: [1000],
        })
          .then(() => {
            const newVideo = new Video({ name: file.name, root: uuid });
            newVideo
              .save()
              .then(video => {
                console.log('Uploaded successfully');
                res.json(video);
              })
              .catch(err => {
                console.log(err);
                res.status(500).end();
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).end();
          });
      })
      .run();
  });
});
app.use('/video', express.static('videos'));
app.get('/video/all', (req, res) => {
  Video.find()
    .then(videos => res.json(videos))
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
});

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to database'))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server Started...'));
