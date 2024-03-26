import useOS from "@/hooks/useOS";
import { useSocket } from "@/providers/SocketContext";
import { useEffect, useState } from "react";

export default function DataPacks() {
  const [datapacks, setDatapacks] = useState<string[]>([]);
  const socket = useSocket();
  const { userOS } = useOS();

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_datapacks")
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("datapack_output", (data: ArrayBuffer) => {
      const decoder = new TextDecoder('utf-8')
      const dataArray = decoder.decode(data);
      const finalArray = dataArray.split("\n").map((line: string) => (line.replace(/.zip/g, '')));
      setDatapacks(finalArray);
    })
  }, [socket])

  return (
    <div className="w-full h-full py-4 pl-4">
      {datapacks.map((pack, i) => (
        <p key={i}>{pack}</p>
      ))}
      {
        userOS === "MacOS" && (
          <div>
            <h2>Upload Datapack</h2>
          </div>
        )
      }
    </div>
  );
}
