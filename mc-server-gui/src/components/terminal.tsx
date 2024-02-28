import { useEffect } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

function TerminalComponent() {
	useEffect(() => {
		const term = new Terminal();
		term.open(document.getElementById("terminal")!);
		const ws = new WebSocket("ws://localhost:8000");

		ws.onmessage = function (event) {
			term.write(event.data);
		};

		term.onData((data) => {
			ws.send(data);
		});
	}, []);

	return <div id="terminal"></div>;
}

export default TerminalComponent;
