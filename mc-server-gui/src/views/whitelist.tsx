import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/api/minecraft-api";
import WhitelistUserCard from "@/components/ui/whitelistUserCard";

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

    socket.on("server_whitelist_output", (data: ArrayBuffer) => {
      const decoder = new TextDecoder('utf-8')
      const dataArray = decoder.decode(data);
      const json = JSON.parse(dataArray);
      setWhitelist(json);

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

export function AddWhitelistUser() {
  const [username, setUsername] = useState<string>("")
  const [searchResults, setSearchResults] = useState<WhitelistUser | null>()
  const [searchError, setSearchError] = useState<string>("")

  return (
    <Card className="">
      <CardHeader>Add a Player to Whitelist</CardHeader>
      <CardContent className="flex gap-8 items-center">
        <form className="space-y-2 w-1/4" onSubmit={
          (e) => {
            e.preventDefault()
            if (!username) {
              setSearchError("Username is required")
              return
            };
            getUserData(username)
              .then((data) => {
                setSearchResults(data); setSearchError("")
              })
              .catch((error) => {
                console.error(error)
                setSearchError("User not found")
              })
          }}>
          {/*  <Label htmlFor="username">Search Username</Label> */}
          <Input id="username" type="text" placeholder="Search Username" onChange={(e) => setUsername(e.target.value)} />
          <Button type="submit" disabled={!username}>Find Player</Button>
        </form>
        {searchResults && <WhitelistUserCard uuid={searchResults.uuid} name={searchResults.name} size={"sm"} />}
        {searchError && <p>{searchError}</p>}
      </CardContent>
    </Card>
  )
}
