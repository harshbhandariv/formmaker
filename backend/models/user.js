const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  username: String,
  profilePicture: String,
  authID: {
    platform: String,
    id: String,
    accessToken: String,
    refreshToken: String,
  },
  forms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Form",
    },
  ],
});

const User = model("User", userSchema);

module.exports = { userSchema, User };
