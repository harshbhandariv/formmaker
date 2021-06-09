var passport = require("passport"),
  GitHubStrategy = require("passport-github2").Strategy;
const { User } = require("../models/user");
const axios = require("axios");

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3500/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      User.findOne({ "authID.id": profile.id }, function (err, user) {
        console.log(err, user);
        if (err || user) return done(err, user);
        const { id, avatar_url, name, login } = profile._json;
        axios
          .get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          })
          .then(({ data }) => {
            User({
              name: name || `Pristine Ability${id}`,
              email: data[0].email,
              username: login,
              profilePicture: avatar_url,
              forms: [],
              authID: {
                platform: "github",
                id,
              },
            }).save(function (err, result) {
              console.log("Authenticated", result);
              done(err, result);
            });
          });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
