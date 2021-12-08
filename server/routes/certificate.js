const express = require("express"),
  router = express.Router(),
  fs = require("fs"),
  path = require("path");

router.get("/", (req, res) => {
  try {
    let cert = fs.readFileSync(
      path.join(__dirname, "../certificates/abels-cert.pem")
    );
    let csr = fs.readFileSync(
      path.join(__dirname, "../certificates/abels-csr.pem")
    );
    let key = fs.readFileSync(
      path.join(__dirname, "../certificates/abels-key.pem")
    );
    res.status(200).send({
      cert,
      csr,
      key,
    });
  } catch (error) {
    console.log("Error fetching certiificate. " + error);
    res.status(500).send("Error fetching certiificate. " + error);
  }
});
module.exports = router;
