const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  comment: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
});

const Comments = new mongoose.model("Comment", dataSchema);

module.exports = Comments;
