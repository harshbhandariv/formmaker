var passport = require("passport"),
  GitHubStrategy = require("passport-github2").Strategy;
const { User } = require("../models/user");

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
        if (err || user) return done(err, user);
        const { id, avatar_url, email, name, login } = profile._json;
        if (email == undefined)
          return done(null, false);
        User({
          name: name || "Pristine Inability",
          email: email,
          username: login,
          profilePicture: avatar_url,
          forms: [],
          authID: {
            platform: "github",
            id,
            accessToken,
          },
        }).save(function (err, result) {
          done(err, result);
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
