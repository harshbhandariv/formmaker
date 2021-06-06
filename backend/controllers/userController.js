const { User } = require("../models/user");
function getUserProfile(id, done) {
  return User.findById(id).exec(function (err, result) {
      return done(err, result);
  });
}

module.exports = { getUserProfile };
