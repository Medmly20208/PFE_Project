const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const DB = process.env.MONGODB_URI;
const PORT = 5000;

mongoose.set("strictQuery", true);
mongoose.connect(DB).then(() => console.log("DB connect successfully"));
console.log("this is my", process.env.test);
const server = app.listen(PORT, () => {
  console.log(`listening in port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join room", (room) => {
    socket.join(room);

    //console.log("user join room", room);
  });

  socket.on("new message", (newMessage) => {
    const room = newMessage.room;

    socket.in(room).emit("message received", newMessage);
  });
});
