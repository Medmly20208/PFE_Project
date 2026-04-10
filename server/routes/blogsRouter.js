const express = require("express");
const blogController = require("../controllers/blogController");

const Router = express.Router();

Router.post("/", blogController.CreateBlog);

Router.get("/:id", blogController.getBlogById);

Router.get("/users/:userId", blogController.getBlogByUserId);

Router.get("/", blogController.getAllBlogs);

Router.delete("/:id", blogController.deleteblogbyID);

Router.patch("/:id", blogController.updateBlog);

//add comment
Router.patch("/:id/comments", blogController.addComment);

//like post
Router.patch("/:id/likes", blogController.addLike);

module.exports = Router;
