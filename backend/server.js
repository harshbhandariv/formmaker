require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require('./config/mongooseConfig');

//body parser middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const morgan = require('morgan');
app.use(morgan('dev'));

require('./config/passportConfig');
const sessionParams = require('./config/sessionConfig');
const passport = require('passport');
const session = require('express-session');
app.use(session(sessionParams));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.send("Hello" + req.user);
});

const auth = require('./routes/auth');
app.use('/auth', auth);

const PORT = process.env.PORT || 3500;
app.listen(PORT, function () {
  console.log(`Listening on PORT ${PORT}`);
});
