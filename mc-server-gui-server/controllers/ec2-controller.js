import { Client } from "ssh2";

import fs from "fs";
import dotenv from "dotenv";

const client = new Client();
let isConnected = false;

dotenv.config();
const EC2_HOST = process.env.EC2_HOST;
const EC2_PRIVATE_KEY = process.env.EC2_PRIVATE_KEY;

const connSettings = {
	host: EC2_HOST,
	port: 22, // Normal is 22 port
	username: "ec2-user",
	privateKey: fs.readFileSync(EC2_PRIVATE_KEY)
};

const connectToEc2Ssh = (socket) => {
	client
		.on("ready", () => {
			console.log("Client :: ready");
			isConnected = true;
			socket.emit("output", "Connected to EC2");
		})
		.on("error", (err) => {
			console.error("Error connecting to EC2: ", err);
		})
		.on("end", () => {
			console.log("Connection ended");
			isConnected = false;
		})
		.on("close", () => {
			console.log("Connection closed");
			isConnected = false;
		})
		.connect(connSettings);
};

const startMcServer = () => {
	client.exec(
		"cd /opt/minecraft/server && sudo screen -dmS mcserver java -Xmx1024M -Xms1024M -jar server.jar nogui",
		(err, stream) => {
			if (err) throw err;
			stream
				.on("close", (code, signal) => {
					console.log("Stream :: close :: code: " + code + ", signal: " + signal);
				})
				.on("data", (data) => {
					console.log("STDOUT: " + data);
					socket.emit("output", data.toString());
				})
				.stderr.on("data", (data) => {
					console.log("STDERR: " + data);
					socket.emit("output", data);
				});
		}
	);
};

const stopMcServer = (socket) => {
	if (!isConnected) {
		console.log("Not connected to EC2");
		socket.emit("output", "Not connected to EC2");
		return;
	}

	client.exec("sudo killall screen", (err, stream) => {
		if (err) throw err;
		stream
			.on("close", (code, signal) => {
				console.log("Stream :: close :: code: " + code + ", signal: " + signal);
			})
			.on("data", (data) => {
				console.log("STDOUT: " + data);
				socket.emit("output", data.toString());
			})
			.stderr.on("data", (data) => {
				console.log("STDERR: " + data);
			});
	});
};

// async function connectToEc2(_, res) {
// 	return new Promise((resolve, reject) => {
// 		if (isConnected) {
// 			res.status(200).json({ message: "Already connected to EC2" });
// 			resolve();
// 			return;
// 		}

// 		client
// 			.on("ready", () => {
// 				console.log("Client :: ready");
// 				res.status(200).json({ message: "Connected to EC2", isConnected: true });
// 				isConnected = true;
// 				startServer();
// 				resolve();
// 			})
// 			.on("error", (err) => {
// 				console.error("Error connecting to EC2: ", err);
// 				res.status(400).json({ message: "Error connecting to EC2. Please check your connections settings." });
// 				reject(err);
// 			})
// 			.connect(connSettings);
// 	});
// }

// function executeCommand(command) {
// 	return new Promise((resolve, reject) => {
// 		if (!isConnected) {
// 			reject();
// 			return;
// 		}

// 		client.exec(command, (err, stream) => {
// 			if (err) {
// 				console.error(`Error executing command "${command}": ${err}`);
// 				reject(err);
// 				return;
// 			}

// 			let output = "";
// 			stream
// 				.on("close", (code, signal) => {
// 					if (code === 0) {
// 						console.log(`Command "${command}" executed successfully with code ${code}`);
// 						resolve(output);
// 					} else {
// 						console.log(`Command "${command}" failed with code ${code}`);
// 						reject(new Error(`Command failed with code ${code}`));
// 					}
// 				})
// 				.on("data", (data) => {
// 					output += data.toString();
// 				})
// 				.stderr.on("data", (data) => {
// 					console.log(`STDERR for "${command}": ${data}`);
// 				});
// 		});
// 	});
// }

// async function startServer(_, res) {
// 	if (!isConnected) {
// 		res.status(400).json({ message: "Not connected to EC2", isConnected: false });
// 		return;
// 	}

// 	const commands = [
// 		// "ls"
// 		"cd /opt/minecraft/server",
// 		// "sudo cd /opt/minecraft/server && java -Xmx1024M -Xms1024M -jar server.jar nogui"
// 		// "sudo screen -S mcserver",
// 		"sudo screen -dmS mcserver java -Xmx1024M -Xms1024M -jar server.jar nogui"
// 		// "sudo java -Xmx1024M -Xms1024M -jar server.jar nogui"
// 	];

// 	for (const command of commands) {
// 		try {
// 			console.log(command);
// 			const output = await executeCommand(command);
// 			console.log(`Output from "${command}": ${output}`); // Output from the command
// 		} catch (error) {
// 			res.status(400).json({
// 				message: "Error starting server. Please check your server settings.",
// 				isConnected: false
// 			});
// 			console.log(`Error executing "${command}": ${error}`);
// 			break; // Exit the loop on error
// 		}
// 	}
// }

export { startMcServer, connectToEc2Ssh, stopMcServer };
