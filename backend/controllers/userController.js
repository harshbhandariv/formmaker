const { User } = require("../models/user");
function getUserProfile(id, done) {
  return User.findById(id).exec(function (err, result) {
    return done(err, result);
  });
}

function checkFormOwner(userID, formID, done) {
  User.findById(userID).select("forms").exec(function (err, user) {
    const result = user.forms.includes(formID);
    done(err, result);
  })
}

module.exports = { getUserProfile, checkFormOwner };
