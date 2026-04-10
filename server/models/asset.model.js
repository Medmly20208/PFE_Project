const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ticker: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;
