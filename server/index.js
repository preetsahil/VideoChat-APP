const socketio = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
// const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
  cors:true
});
dotenv.config("./env");

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    //sending to remote user
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log(ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
