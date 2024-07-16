const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotevn = require("dotenv");
dotevn.config();

const app = express();

const port = process.env.PORT;
const client = process.env.CLIENT;

app.use(express.json());

app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server running in port: ${port}`);
});

const ServerSI = new Server(server, {
  cors: {
    origin: "*",
  },
});

ServerSI.on("connection", (socket) => {
  console.log("Connected client");

  socket.on(client, (message) => {
    ServerSI.emit(client, message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect client");
  });
});