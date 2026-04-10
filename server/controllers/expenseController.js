const expenseModel = require("../models/expense.model");
const catchAsync = require("../utils/catchAsync");

//create expenses
exports.CreateExpense = catchAsync(async (req, res) => {
  const expense = await expenseModel.create({ ...req.body });

  res.status(200).json({
    status: "success",
    data: expense,
  });
});

//delete expense by id
exports.DeleteExpenseById = catchAsync(async (req, res) => {
  const expense = await expenseModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});

exports.UpdateExpenseById = catchAsync(async (req, res) => {
  const expense = await expenseModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: expense,
  });
});

//getExpensesBy req.body
exports.getExpenses = catchAsync(async (req, res) => {
  let queryObj;

  if (!req.query.userId) {
    res.status(400).json({
      status: "bad request",
    });
  }

  if (!req.query["startDate"] && !req.query["endDate"]) {
    queryObj = { ...req.query };
  } else {
    queryObj = {
      ...req.query,
      date: {
        $lte: new Date(req.query["endDate"]),
        $gte: new Date(req.query["startDate"]),
      },
    };

    delete queryObj.startDate;
    delete queryObj.endDate;
  }

  if (queryObj.category === "All") {
    queryObj.category = {
      $in: ["Food", "Other", "Transportation", "Entertainment", "Shelter"],
    };
  }

  if (queryObj.search?.length > 0) {
    queryObj.title = { $regex: req.query.search, $options: "i" };
    delete queryObj.search;
  }

  const expense = await expenseModel.find(queryObj);

  res.status(200).json({
    status: "success",
    data: expense,
  });
});

//get 4 latest expenses
exports.getLatestExpenses = catchAsync(async (req, res) => {
  const expense = await expenseModel
    .find({ userId: req.params.id })
    .sort({ createdAt: -1 })
    .limit(4);

  res.status(200).json({
    status: "success",
    data: expense,
  });
});
