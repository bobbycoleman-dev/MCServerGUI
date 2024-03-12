import { useSocket } from "@/providers/SocketContext";
import { Button } from "./ui/button";

export default function GiveDiamond() {
  const socket = useSocket()
  if (!socket) return

  return <Button onClick={() => socket.emit("give_diamond")}>Give Diamond</Button>;
}
