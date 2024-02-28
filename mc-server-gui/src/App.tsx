import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { connectToEc2, startServer } from "./api/ec2-api";
import TerminalComponent from "./components/terminal";
import io from "socket.io-client";

export const socket = io("http://localhost:8000");

function App() {
	const [isConnected, setIsConnected] = useState(false);
	const [output, setOutput] = useState("");

	useEffect(() => {
		socket.on("output", (data: string) => {
			setOutput(data);
		});
	}, []);

	const handleClick = () => {
		console.log("clicked");
		socket.emit("ec2-connect");
	};

	return (
		<div className="container py-4">
			<ModeToggle />
			{/* {!isConnected ? (
				<Button onClick={() => connectToEc2().then((res) => setIsConnected(res.isConnected))}>
					Connect to EC2
				</Button>
			) : (
				<Button
					onClick={() =>
						startServer().then((res) => {
							if (res.isConnected === false) setIsConnected(false);
						})
					}>
					Start Server
				</Button>
			)} */}
			{/* <TerminalComponent /> */}

			<Button onClick={() => handleClick()}>Connect to EC2</Button>
			<Button onClick={() => socket.emit("start-mc-server")}>Start Server</Button>
			<Button onClick={() => socket.emit("stop-mc-server")}>Stop Server</Button>
			{output && <div>{output}</div>}
		</div>
	);
}

export default App;
