const blogModel = require("../models/blog.model");
const catchAsync = require("../utils/catchAsync");

//create blog
exports.CreateBlog = catchAsync(async (req, res) => {
  const blog = await blogModel.create({ ...req.body });

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.getBlogById = catchAsync(async (req, res) => {
  const blog = await blogModel.find({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.getAllBlogs = catchAsync(async (req, res) => {
  const blog = await blogModel.find();

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.getBlogByUserId = catchAsync(async (req, res) => {
  let queryObj = req.query;

  if (queryObj.title?.length > 0) {
    queryObj.title = { $regex: req.query.title, $options: "i" };
  } else {
    queryObj = {};
  }

  if (!req.params.userId) {
    return res.status(401).json({
      status: "failed",
      message: "userId is undefined",
    });
  }
  const blog = await blogModel.find({ userId: req.params.userId, ...queryObj });

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.deleteblogbyID = catchAsync(async (req, res) => {
  const blog = await blogModel.findByIdAndDelete({ _id: req.params.id });

  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const blog = await blogModel.findByIdAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: blog,
  });
});

exports.addComment = catchAsync(async (req, res) => {
  const blog = await blogModel.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { comments: req.body } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: blog,
  });
});

exports.addLike = catchAsync(async (req, res) => {
  let blog;
  const blogPost = await blogModel.findOne({ _id: req.params.id });
  if (!blogPost) {
    return res.status(404).json({
      status: "failed",
      message: "this blog post doesn't exist",
    });
  }

  const isLikedAlready = blogPost.likes.filter(
    (like) => like.likerId === req.body.likerId
  );

  if (isLikedAlready.length > 0) {
    blog = await blogModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: { likerId: req.body.likerId } } },
      { new: true }
    );
  } else {
    blog = await blogModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { likes: req.body } },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    message: blog,
  });
});
