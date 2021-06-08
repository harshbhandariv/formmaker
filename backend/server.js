require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("./config/mongooseConfig");

//body parser middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

require("./config/passportConfig");
const sessionParams = require("./config/sessionConfig");
const passport = require("passport");
const session = require("express-session");
app.use(session(sessionParams));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "devolopment")
  app.get("/", function (req, res) {
    res.send("Hello" + req.user);
  });

const auth = require("./routes/auth");
const userRoute = require("./routes/userRoute");
const formRoute = require("./routes/formRoute");
app.use("/auth", auth);
app.use("/api/user", userRoute);
app.use("/api/form", formRoute);
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

const PORT = process.env.PORT || 3500;
app.listen(PORT, function () {
  console.log(`Listening on PORT ${PORT}`);
});
