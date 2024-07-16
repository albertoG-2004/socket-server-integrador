const express = require("express");
const { Server } = require("socket.io");
const pkg = require("signale");
const cors = require("cors");
const dotevn = require("dotenv");
dotevn.config();

const app = express();

const port = process.env.PORT;
const client = process.env.CLIENT;
const { Signale } = pkg;
const sigOptions = {
    secrets: ["([0-9]{4}-?)+"]
};
const signale = new Signale(sigOptions);

app.use(express.json());

app.use(cors());

const server = app.listen(port, () => {
  signale.success("Socket server running in port: " + port);
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