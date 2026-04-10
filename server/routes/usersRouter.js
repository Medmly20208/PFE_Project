const express = require("express");
const userController = require("../controllers/userControllers");

const Router = express.Router();

Router.post(
  "/signup",
  userController.ValidateSignUpData,
  userController.SignUp
);
Router.post("/login", userController.ValidateLogInData, userController.LogIn);
Router.get("/:id", userController.getUserNameById);
Router.put("/:id", userController.updateNameById);

module.exports = Router;
