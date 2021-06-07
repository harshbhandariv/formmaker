const { checkFormOwner } = require("../controllers/userController");

module.exports = function checkeligible(req, res, next) {
  if (req.user) {
    checkFormOwner(req.user._id, req.params.formID, function (err, result) {
      if (err)
        return res.status(500).send({
          message: "Internal Server Error",
        });
      if (result) return next();
      return res
        .status(403)
        .send({ message: "User Forbidden", formOwner: false });
    });
  } else {
    res.status(401).send({ message: "Access Denied", loggedIn: false });
  }
};
