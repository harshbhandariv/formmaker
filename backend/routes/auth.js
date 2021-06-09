const express = require("express");
const router = express.Router();
const passport = require("passport");
const loggedIn = require("../utils/loggedIn");
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/authentication/fail", failureFlash: true }),
  function (req, res) {
    // Successful authentication, redirect home.
    if (process.env.NODE_ENV === "development")
      return res.redirect("http://localhost:3000/dashboard");
    res.redirect("/");
  }
);

router.get("/loggedIn", loggedIn, function (req, res) {
  res.send({
    message: "loggedIn",
    loggedIn: true,
  });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.status(200).send({
    message: "Logout Succesful",
  });
});
module.exports = router;
