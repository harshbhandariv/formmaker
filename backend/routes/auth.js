const express = require("express");
const router = express.Router();
const passport = require("passport");
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.status(200).send({
    message: "Logout Succesful",
  });
});
module.exports = router;
