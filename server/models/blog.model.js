const mongoose = require("mongoose");

const like = mongoose.Schema({
  likerId: {
    type: String,
    required: true,
  },
});

const comment = mongoose.Schema(
  {
    commentorId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const blog = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [like],
    },

    comments: {
      type: [comment],
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", blog);

module.exports = blogModel;
