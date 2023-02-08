const express = require("express");
const router = express.Router();
const connection = require("./connection");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));

router.post("/register", (req, res) => {
  const { appId, CPU, MEMORY, DISK, location, modelNumber, osVersion, rootVolume, hostName } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ipAddress);

  connection.query(
    "CALL insert_server_data(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [ipAddress, appId, CPU, MEMORY, DISK, location, modelNumber, osVersion, rootVolume, hostName],
    (error, results) => {
      if (error) {
        return res.send(error);
      }
      res.send(results[0]);
    }
  );
});

router.get("/getregister", (req, res) => {
    const filePath = path.join(__dirname, "./scripts/register.sh");
  
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Error reading file" });
      }
  
      res.set("Content-Type", "text/plain");
      res.send(data);
    });
});

module.exports = router;
