const mongoose = require("mongoose");

const message = mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },

    room: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", message);

module.exports = messageModel;
