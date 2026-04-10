const messageModel = require("../models/message.model");
const catchAsync = require("../utils/catchAsync");

//create message
exports.CreateMessage = catchAsync(async (req, res) => {
  const message = await messageModel.create({ ...req.body });

  res.status(200).json({
    status: "success",
    data: message,
  });
});

//getExpensesBy req.body
exports.getMessages = catchAsync(async (req, res) => {
  const messages = await messageModel.find({ room: req.params.room });

  res.status(200).json({
    status: "success",
    data: messages,
  });
});
