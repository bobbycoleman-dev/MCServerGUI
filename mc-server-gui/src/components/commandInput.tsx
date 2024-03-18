import { useState } from "react";
import { Input } from "./ui/input";
import { useSocket } from "@/providers/SocketContext";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const socket = useSocket();

  if (!socket) return null;

  return (
    <div className="w-full relative">
      <Input
        placeholder="Enter command"
        className="cursor-pointer"
        value={command}
        onChange={e => setCommand(e.target.value)}
        onFocus={() => { if (!command) setCommand("/") }}
        onBlur={() => { if (command === "/") setCommand("") }}
        autoCorrect="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            socket.emit("minecraft_command", command);
            setCommand("/");
          }
        }}
      />
      {
        command &&
        <Button
          variant="ghost"
          className="absolute right-0 top-0"
          onClick={() => setCommand("")}
        ><XCircle />
        </Button>
      }
    </div>
  )
}
