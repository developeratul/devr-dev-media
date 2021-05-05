const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoUrl: { type: String },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  profession: { type: String, required: true },
  date: { type: String, required: true },

  tokens: [{ token: { type: String, required: true } }],

  followers: [{ type: ObjectId, ref: "User" }],
  followings: [{ type: ObjectId, ref: "User" }],

  bio: String,
  skills: String,
  hackingOn: String,
  currentlyLearning: String,
  portfolio: String,
  github: String,
  twitter: String,
  dev: String,
});

dataSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { id: this._id.toString() },
      process.env.AUTH_SECRET
    );

    this.tokens = this.tokens.concat({ token });

    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

dataSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const Users = new mongoose.model("User", dataSchema);

module.exports = Users;
