const express = require("express");
const router = express.Router();
const con = require("./connection");
const jwt = require("jsonwebtoken");
const JWTkey = require("./config").JWTkey;

router.post("/", (req, res) => {
  //const user = req.body.User_ID;
  //const pwd = req.body.Password;
  const user = req.body.User_ID || req.body.user_id;
const pwd = req.body.Password || req.body.password;

  if (!user || !pwd) {
    return res.status(400).send({ error: "Please provide both username and password" });
  }

  const query = `SELECT Role_ID, First_Name, Last_Name FROM mst_accnts WHERE User_ID = ? AND Password = ?`;
  con.query(query, [user, pwd], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    }
    if (data.length === 0) {
      return res.status(400).send({ error: "Incorrect username and password" });
    }

    const payload = { user: data[0] };
    const options = { expiresIn: "1h" };
    jwt.sign(payload, JWTkey, options, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error" });
      }
      res.json({ data: payload.user, token });
    });
  });
});

module.exports = router;
