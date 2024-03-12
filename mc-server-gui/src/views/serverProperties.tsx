import { useSocket } from "@/providers/SocketContext";
import { useEffect, useState } from "react";

export default function ServerProperties() {
  const [properties, setProperties] = useState<string[]>([])
  const socket = useSocket()
  useEffect(() => {
    if (!socket) return;

    socket.emit("get_server_properties")

    socket.on("server_properties_output", (data: ArrayBuffer) => {
      const decoder = new TextDecoder('utf-8')
      const dataArray = decoder.decode(data);
      setProperties(dataArray.split("\n"));

    })
  }, [socket])
  return (
    <div className="w-full h-full py-4 pl-4 overflow-y-scroll">
      <div>{properties.map((line, i) => (<p key={i}>{line}</p>))}</div>
    </div>
  );
}
