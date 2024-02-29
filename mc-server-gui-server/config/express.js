import express from "express";
import cors from "cors";
import ec2Router from "../routes/ec2-routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectToEc2Ssh, disconnectFromEc2Ssh, startMcServer, stopMcServer } from "../controllers/ec2-controller.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: true });
let isServerRunning = false;

app.use(express.json(), cors());

app.use("/api/v1/ec2", ec2Router);

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.emit("initial_server_status", isServerRunning);

	socket.on("ec2_connect", () => {
		connectToEc2Ssh(socket);
	});

	socket.on("ec2_disconnect", () => {
		disconnectFromEc2Ssh(socket);
	});

	socket.on("start_server", () => {
		startMcServer(socket);
		isServerRunning = true;
	});

	socket.on("stop_server", () => {
		stopMcServer(socket);
		isServerRunning = false;
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

export default server;
