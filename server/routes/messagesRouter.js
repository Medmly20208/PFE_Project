const express = require("express");
const messageController = require("../controllers/messageController");

const Router = express.Router();

Router.post("/", messageController.CreateMessage);

Router.get("/:room", messageController.getMessages);

module.exports = Router;
