const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const SELECT_QUERY = `SELECT cpu_util, mem_util, ntp_status, ntp_delay, total_mem , root_vol, up_time, server_ip, server_id, time_stamp, server_ip, server_id, app_id  FROM server_snap WHERE app_id= ${id}`;

  connection.query(SELECT_QUERY, (error, results, fields) => {
    if (error) {
      res.send({
        "code": 400,
        "failed": error.message
      });
    } else {
      if (results.length > 0) {
        const data = results.map(result => {
          let colorCode = 'green';
          if (result.cpu_util > 90 || result.mem_util > 90) {
            colorCode = 'red';
          } else if (result.cpu_util > 80 || result.mem_util > 80) {
            colorCode = 'orange';
          }
          return {
            ...result,
            colorCode
          };
        });
        res.send({
          "code": 200,
          "success": "Snap found",
          "data": data
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


router.get("/shortsnap/:sid", (req, res) => {
    const { sid } = req.params;
    const SELECT_QUERYs = `SELECT cpu_util, mem_util, ntp_status, root_vol, server_ip, server_id FROM server_snap WHERE app_id = ${sid}`;
    
    connection.query(SELECT_QUERYs, (error, results, fields) => {
    if (error) {
    res.send({
    "code": 400,
    "failed": error.message
    });
    } else {
    if (results.length > 0) {
    res.send({
    "code": 200,
    "success": "Snap found",
    "data": results
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
