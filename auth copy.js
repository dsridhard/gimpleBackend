const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

require("dotenv").config();

const connection = require("./connection");

// Verify user credentials
async function verifyUser(user_id, password) {
try {
const query = "SELECT * FROM mst_accnts WHERE User_ID = ?";
const [rows] = await connection.query(query, [user_id]);
if (!rows.length) {
return {
error: "User not found",
};
}
const user = rows[0];
const passwordMatch = await bcrypt.compare(password, user.Password);
if (!passwordMatch) {
return {
error: "Incorrect Password",
};
}
if (user.Enabled === 0) {
return {
error: "Contact administrator. Your account is disabled",
};
}
return {
user_id: user.User_ID,
first_name: user.First_Name,
last_name: user.Last_Name,
role_id: user.Role_ID,
};
} catch (err) {
console.log(err);
return {
error: "An error occurred. Please try again later.",
};
}
}

// Route to handle user login
router.post(
"/",
[
check("user_id", "Please enter a valid user ID").not().isEmpty(),
check("password", "Please enter a valid password").not().isEmpty(),
],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
const { user_id, password } = req.body;
const user = await verifyUser(user_id, password);
if (user.error) {
return res.status(400).json({ message: user.error });
}
const payload = {
user: {
user_id: user.user_id,
first_name: user.first_name,
last_name: user.last_name,
role_id: user.role_id,
},
};
jwt.sign(
payload,
process.env.JWT_SECRET,
{ expiresIn: "1h" },
(err, token) => {
if (err) throw err;
res.status(200).json({ token });
}
);
}
);

module.exports = router;