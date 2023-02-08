const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.get("/", (req, res) => {
  connection.query(`SELECT * FROM apps_mst`, (error, results, fields) => {
    if (error) {
      res.send({
        "code": 400,
        "failed": error.message
      });
    } else {
      if (results.length > 0) {
        res.send({
          "code": 200,
          "success": "Apps found",
          "data": results
        });
      } else {
        res.send({
          "code": 204,
          "success": "Apps not found"
        });
      }
    }
  });
});

module.exports = router;
