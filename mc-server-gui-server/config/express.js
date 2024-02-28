import express from "express";
import cors from "cors";
import ec2Router from "../routes/ec2-routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectToEc2Ssh, startMcServer, stopMcServer } from "../controllers/ec2-controller.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: true });

app.use(express.json(), cors());

app.use("/api/v1/ec2", ec2Router);

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("ec2-connect", () => {
		console.log("Conencting to EC2...");

		connectToEc2Ssh(socket);
	});

	socket.on("start-mc-server", () => {
		console.log("Starting Minecraft server...");

		startMcServer(socket);
	});

	socket.on("stop-mc-server", () => {
		console.log("Stopping Minecraft server...");

		stopMcServer(socket);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

export default server;
