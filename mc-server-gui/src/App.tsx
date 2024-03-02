import { useEffect, useState } from "react";

import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

import { io } from "socket.io-client";
import { useToast } from "./components/ui/use-toast";
import CountdownTimer from "./components/ui/countdown";
import { userLoggedOff, userLoggedOn } from "./lib/utils";

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
	const [output, setOutput] = useState<string[]>([]);
	const [loggedOnUsers, setLoggedOnUsers] = useState<string[]>([]);
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
				// socket.emit("change_directory");
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

		socket.on("log_output", (data: string) => {
			const loggedOnUser = userLoggedOn(data);
			const loggedOffUser = userLoggedOff(data);
			if (loggedOffUser) {
				setLoggedOnUsers((prev) => prev.filter((user) => user !== loggedOffUser));
			}
			if (loggedOnUser) {
				setLoggedOnUsers((prev) => {
					if (prev.includes(loggedOnUser)) {
						return prev;
					}
					return [...prev, loggedOnUser];
				});
			}
			setOutput((prev) => [...prev, data]);
		});
	}, [socket]);

	return (
		<div className="container py-4 relative h-dvh w-full flex justify-between items-center">
			<div className="absolute bottom-4 right-4">
				<ModeToggle />
			</div>
			<div className="w-1/4 border-r-2 h-full flex flex-col items-center p-4 flex-shrink-0 min-w-[200px]">
				{isConnected ? (
					<div className="flex flex-col gap-4">
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
					</div>
				) : (
					<Button className="flex-shrink-0" onClick={() => socket.emit("ec2_connect")}>
						Connect to EC2
					</Button>
				)}
			</div>

			<div className="w-3/4 h-full">
				{startingServer && <CountdownTimer />}
				{output && (
					<div className=" w-full max-h-[500px] overflow-y-scroll border">
						{output.map((log, i) => (
							<p key={i} className="text-sm">
								{log}
							</p>
						))}
					</div>
				)}
				<div className="mt-4 flex flex-col gap-2">
					<h2 className="text-lg font-bold">Logged On Users</h2>
					{loggedOnUsers.length === 0 && <p>No users logged on</p>}
					{loggedOnUsers.map((user, i) => (
						<p key={i}>{user}</p>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
