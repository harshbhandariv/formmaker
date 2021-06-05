require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require('./config/mongooseConfig');

//body parser middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log(`Listening on PORT ${PORT}`);
});
