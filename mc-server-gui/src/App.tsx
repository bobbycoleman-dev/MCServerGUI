import { useEffect, useState } from "react";

import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

import { io } from "socket.io-client";
import { useToast } from "./components/ui/use-toast";
import CountdownTimer from "./components/ui/countdown";

export const socket = io("http://localhost:8000");

type ConnectionOutput = {
	message: string;
	isConnected: boolean;
};

type ServerOutput = {
	message: string;
	data?: string;
	isRunning: boolean;
};

function App() {
	const [isConnected, setIsConnected] = useState(false);
	const [isServerRunning, setIsServerRunning] = useState(false);
	const [startingServer, setStartingServer] = useState(false);
	const [countDown, setCountDown] = useState(30);
	const [output, setOutput] = useState("");
	const { toast } = useToast();

	useEffect(() => {
		socket.on("connection_output", (data: ConnectionOutput) => {
			setIsConnected(data.isConnected);
			if (data.isConnected) {
				toast({
					variant: "success",
					title: "EC2 Connection Status",
					description: data.message
				});
			} else {
				toast({
					variant: "destructive",
					title: "EC2 Connection Status",
					description: data.message
				});
			}
		});

		socket.on("start_stop_output", (data: ServerOutput) => {
			if (data.isRunning) {
				setStartingServer(true);
				setTimeout(() => {
					setStartingServer(false);
					setIsServerRunning(data.isRunning);
					toast({
						variant: "success",
						title: "Minecraft Server Status",
						description: data.message
					});
				}, 1000 * 30);
			} else {
				setIsServerRunning(data.isRunning);
				toast({
					variant: "destructive",
					title: "Minecraft Server Status",
					description: data.message
				});
			}
		});

		socket.on("initial_server_status", (data) => {
			setIsServerRunning(data);
		});
	}, [socket]);

	// if (!isServerRunning && startingServer) {
	// 	return <Button disabled>Starting Server...</Button>
	// } else if (isServerRunning) {
	// 	return <Button variant="destructive" onClick={() => socket.emit("stop_server")}>Stop Server</Button>
	// } else {
	// 	<Button className="bg-green-500" onClick={() => socket.emit("start_server")}>Start Server</Button>
	// }

	return (
		<div className="container py-4 relative h-dvh w-full flex justify-center items-center">
			<div className="absolute bottom-4 right-4">
				<ModeToggle />
			</div>

			{isConnected ? (
				<div className="flex flex-col gap-4 w-1/3">
					<Button onClick={() => socket.emit("ec2_disconnect")}>Disconnect from EC2</Button>
					{isServerRunning ? (
						<Button variant="destructive" onClick={() => socket.emit("stop_server")}>
							Stop Server
						</Button>
					) : (
						<Button
							disabled={startingServer}
							className="bg-green-500"
							onClick={() => socket.emit("start_server")}>
							{startingServer ? "Starting Server..." : "Start Server"}
						</Button>
					)}
					{startingServer && <CountdownTimer />}
				</div>
			) : (
				<div className="w-1/3 flex flex-col justify-center">
					<Button onClick={() => socket.emit("ec2_connect")}>Connect to EC2</Button>
				</div>
			)}
		</div>
	);
}

export default App;
