const express = require("express"),
  router = express.Router(),
  fs = require("fs"),
  path = require("path");

router.get("/", (req, res) => {
  try {
    let cert = fs.readFileSync(
      path.join(__dirname, "../certificates/cert.pem")
    );
    let chain = fs.readFileSync(
      path.join(__dirname, "../certificates/chain.pem")
    );
    let fullchain = fs.readFileSync(
      path.join(__dirname, "../certificates/fullchain.pem")
    );
    let privkey = fs.readFileSync(
      path.join(__dirname, "../certificates/privkey.pem")
    );
    let abelscert = fs.readFileSync(
      path.join(__dirname, "../certificates/abels/abels-cert.pem")
    );
    res.status(200).send({
      cert,
      chain,
      fullchain,
      privkey,
      abelscert,
    });
  } catch (error) {
    console.log("Error fetching certiificate. " + error);
    res.status(500).send("Error fetching certiificate. " + error);
  }
});
module.exports = router;
