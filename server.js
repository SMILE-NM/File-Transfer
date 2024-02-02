// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketIo(server, {
  maxHttpBufferSize: 1e10,
  cors: {
    origin: "*", // Разрешаем доступ от всех доменов
    methods: ["GET", "POST"], // Разрешаем методы GET и POST
    credentials: true, // Разрешаем передачу учетных данных (если нужно)
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("sendMessage", (message) => {
    console.log("Received message:", message);
    io.emit("message", message); // Отправляем сообщение всем клиентам, подключенным к сокету
  });

  socket.on("uploadFile", (fileData) => {
    console.log("Received file data:", fileData);
    io.emit("fileUploaded", fileData);
  });
});

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Listening on port ${port}`));
