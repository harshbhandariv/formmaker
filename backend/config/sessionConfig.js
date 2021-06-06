const MongoStore = require("connect-mongo");

module.exports = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60,
  }),
  saveUninitialized: true,
};