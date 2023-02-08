const express = require("express");
const app = express();
const authRoutes = require("./auth");
const snapRoutes = require("./snap");
const appsRoutes = require("./apps");
const dotsRoutes = require("./dots");
const serverRoutes = require("./server");


var cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/snap", snapRoutes);
app.use("/apps", appsRoutes);
app.use("/dots", dotsRoutes);
app.use("/server",serverRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

