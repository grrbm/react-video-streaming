const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema").User,
  shortid = require("shortid");

router.get("/stream_key", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("User not logged in.");
  }
  const userEmail = req.user.email;
  try {
    const user = await User.findOne({ email: req.user.email });
    res.status(200).json({
      stream_key: user.stream_key,
    });
  } catch (error) {
    return res.status(500).send("Error getting streaming key");
  }
});

router.post("/stream_key", (req, res) => {
  if (!req.user) {
    return res.status(401).send("User not logged in.");
  }
  User.findOneAndUpdate(
    {
      email: req.user.email,
    },
    {
      stream_key: shortid.generate(),
    },
    {
      upsert: true,
      new: true,
    },
    (err, user) => {
      if (!err) {
        res.json({
          stream_key: user.stream_key,
        });
      }
    }
  );
});

module.exports = router;
