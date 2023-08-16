const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Post must have an owner"],
  },
  title: {
    type: String,
    required: [true, "Post must have title"],
  },
  body: {
    type: String,
    required: [true, "Post must have body"],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
