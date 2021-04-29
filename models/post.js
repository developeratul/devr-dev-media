const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  imgUrl: { type: String },
  userId: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  likers: [{ liker: { type: String } }],
});

const Posts = new mongoose.model("Post", dataSchema);

module.exports = Posts;
