const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  commentId: { type: String, required: true },
  reply: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
});

const Reply = new mongoose.model("Reply", dataSchema);

module.exports = Reply;
