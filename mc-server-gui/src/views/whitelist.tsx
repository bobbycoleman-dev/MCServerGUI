import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/api/minecraft-api";
import WhitelistUserCard from "@/components/ui/whitelistUserCard";
import AddWhitelistUser from "@/components/addWhitelistPlayer";

type WhitelistUser = {
  uuid: string;
  name: string;
}

export default function WhiteList() {
  const [whitelist, setWhitelist] = useState<WhitelistUser[]>([])
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_whitelist")
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket.on("server_whitelist_output", (data: ArrayBuffer) => {
      const decoder = new TextDecoder('utf-8')
      const dataArray = decoder.decode(data);
      const json = JSON.parse(dataArray);
      setWhitelist(json);
    })

    socket.on("whitelsit_updated", () => {
      socket.emit("get_whitelist")
    })
  }, [socket])

  return (
    <div className="w-full h-full py-4 pl-4 flex flex-col justify-between">
      <div className="flex flex-wrap gap-4 overflow-y-scroll">
        {whitelist.map((line) => <WhitelistUserCard key={line.uuid} uuid={line.uuid} name={line.name} size={"md"} />)}
      </div>
      <AddWhitelistUser />
    </div>
  );
}

