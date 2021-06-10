var passport = require("passport"),
  GitHubStrategy = require("passport-github2").Strategy,
  TwitterStrategy = require("passport-twitter").Strategy;
GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { User } = require("../models/user");
const axios = require("axios");
let {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CALLBAACK_URL,
  TWITTER_CALLBAACK_URL,
  GOOGLE_CALLBAACK_URL,
} = process.env;

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBAACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      User.findOne(
        { "authID.id": profile.id, "authID.platform": "GitHub" },
        function (err, user) {
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
                  platform: "GitHub",
                  id,
                  accessToken,
                  refreshToken: "none",
                },
              }).save(function (err, result) {
                done(err, result);
              });
            });
        }
      );
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: TWITTER_CALLBAACK_URL,
      includeEmail: true,
    },
    function (token, tokenSecret, profile, cb) {
      User.findOne(
        { "authID.id": profile.id, "authID.platform": "Twitter" },
        function (err, user) {
          if (err || user) return cb(err, user);
          const { id_str, profile_image_url, email, name, screen_name } =
            profile._json;
          User({
            name: name || `Pristine Ability${id}`,
            email: email,
            username: screen_name,
            profilePicture: profile_image_url.replace(/normal/, "400x400"),
            forms: [],
            authID: {
              platform: "Twitter",
              id: id_str,
              accessToken: token,
              refreshToken: tokenSecret,
            },
          }).save(function (err, result) {
            cb(err, result);
          });
        }
      );
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBAACK_URL,
    },
    function (token, tokenSecret, profile, cb) {
      User.findOne(
        { "authID.id": profile.id, "authID.platform": "Google" },
        function (err, user) {
          console.log("dream", err, user, "dream");
          if (err || user) return cb(err, user);
          const { sub, name, picture, email } = profile._json;
          User({
            name: name || `Pristine Ability${id}`,
            email: email,
            username: email,
            profilePicture: picture,
            forms: [],
            authID: {
              platform: "Google",
              id: sub,
              accessToken: token,
              refreshToken: "none",
            },
          }).save(function (err, result) {
            cb(err, result);
          });
        }
      );
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
