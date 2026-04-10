const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./routes/usersRouter");
const expensesRouter = require("./routes/expensesRouter");
const messagesRouter = require("./routes/messagesRouter");
const blogsRouter = require("./routes/blogsRouter");
const assetsrouter = require("./routes/assetRouter");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// { credentials: true, origin: "http://192.168.100.117" }
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/assets", assetsrouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/messages", messagesRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`this route ${req.originalUrl} doesn't exist on server`, 404),
  );
});

app.use(globalErrorHandler);

module.exports = app;
