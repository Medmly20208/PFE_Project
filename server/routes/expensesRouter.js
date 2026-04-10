const express = require("express");
const expenseController = require("../controllers/expenseController");

const Router = express.Router();

Router.post("/", expenseController.CreateExpense);

Router.get("/", expenseController.getExpenses);

Router.put("/:id", expenseController.UpdateExpenseById);

Router.delete("/:id", expenseController.DeleteExpenseById);

Router.get("/latest/:id", expenseController.getLatestExpenses);

module.exports = Router;
