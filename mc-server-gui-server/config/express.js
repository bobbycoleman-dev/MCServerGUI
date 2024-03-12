import express from "express";
import cors from "cors";
import ec2Router from "../routes/ec2-routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  connectToEc2Ssh,
  disconnectFromEc2Ssh,
  getLogs,
  getServerProperties,
  giveDiamond,
  startMcServer,
  stopMcServer,
} from "../controllers/ec2-controller.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: true });

app.use(express.json(), cors());

app.use("/api/v1/ec2", ec2Router);

io.on("connection", (socket) => {
  console.log("a user connected");

  connectToEc2Ssh(socket);

  socket.on("server_status", () => {
    getLogs(socket);
  });

  socket.on("start_server", () => {
    startMcServer(socket);
  });

  socket.on("stop_server", () => {
    stopMcServer(socket);
  });

  socket.on("get_server_properties", () => {
    getServerProperties(socket);
  });

  socket.on("give_diamond", () => {
    giveDiamond(socket);
  });

  socket.on("disconnect", () => {
    disconnectFromEc2Ssh(socket);
    console.log("user disconnected");
  });
});

export default server;
