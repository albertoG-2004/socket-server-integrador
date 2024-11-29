const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const pkg = require("signale");

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;
const { Signale } = pkg;
const sigOptions = {
  secrets: ["([0-9]{4}-?)+"]
};
const signale = new Signale(sigOptions);

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = app.listen(port, () => {
  signale.success("Socket server running in port: " + port);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


io.on("connection", (socket) => {
  signale.success(`New client connected: ${socket.id}`);

  socket.on("bananas", (data) => {
    signale.info("Data received on 'bananas':", data);
    const { date, time, color, classification } = data;

    io.emit("bananas", {
      date: date,
      time: time,
      color: color,
      classification: classification
    });
  });

  socket.on("monitorings", (data) => {
    signale.info("Data received on 'monitorings':", data);
    const { box, date, time, temperature, humidity, weight } = data;

    io.emit("monitorings", {
      box: box,
      date: date,
      time: time,
      temperature: temperature,
      humidity: humidity,
      weight: weight
    });
  });

  socket.on("disconnect", () => {
    signale.warn(`Client disconnected: ${socket.id}`);
  });
});