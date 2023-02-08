const express = require("express");
const connection = require("./connection");
const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const SELECT_QUERY = `SELECT cpu_util, time_stamp, mem_util, ntp_status, root_vol, server_ip, server_id, app_id FROM server_snap WHERE app_id = ${id}`;

  connection.query(SELECT_QUERY, (error, results, fields) => {
    if (error) {
      res.send({
        "code": 400,
        "failed": error.message
      });
    } else {
      if (results.length > 0) {
        const filteredResults = results.map(result => {
          const { app_id, server_id, server_ip } = result;
          let colorcode = 'green';
          
          if (result.time_stamp > 5 * 60 * 1000) {
            colorcode = 'grey';
          } else if (result.cpu_util > 80 || result.mem_util > 80 || result.root_vol > 80) {
            colorcode = 'orange';
          } else if (result.ntp_status === 1) {
            colorcode = 'red';
          }
          
          return { app_id, server_id, server_ip, colorcode };
        });
        
        res.send({
          "code": 200,
          "success": "Snap found",
          "data": filteredResults
        });
      } else {
        res.send({
          "code": 204,
          "success": "Snap not found"
        });
      }
    }
  });
});

module.exports = router;
