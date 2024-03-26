import { useState } from "react";
import { useSocket } from "@/providers/SocketContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/api/minecraft-api";
import WhitelistUserCard from "@/components/ui/whitelistUserCard";

type WhitelistUser = {
  uuid: string;
  name: string;
}

export default function AddWhitelistUser() {
  const socket = useSocket()
  const [username, setUsername] = useState<string>("")
  const [searchResults, setSearchResults] = useState<WhitelistUser | null>()
  const [searchError, setSearchError] = useState<string>("")

  if (!socket) return

  return (
    <Card className="pt-4 h-[225px]">
      <CardContent className="flex flex-col gap-2 justify-center h-full">
        <div className="flex">
          <p className="text-center w-1/3">Search Player</p>
          <p className="text-center w-1/3">Verify Player</p>
          <p className="text-center w-1/3">Add Player</p>
        </div>
        <div className="flex items-center gap-4 h-full">
          <form className="space-y-2 w-1/3 h-full flex flex-col justify-center" onSubmit={
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
            <Input id="username" autoCorrect="off" type="text" placeholder="Search Username" onChange={(e) => setUsername(e.target.value)} />
            <Button type="submit" className="w-full" disabled={!username}>Find Player</Button>
          </form>
          <div className="w-1/3 flex justify-center">
            {searchResults && <WhitelistUserCard uuid={searchResults.uuid} name={searchResults.name} size={"sm"} displayOnly={true} />}
            {searchError && <p>{searchError}</p>}
          </div>
          <div className="w-1/3 flex flex-col">
            {searchResults &&
              <Button
                className="w-full self-center text-wrap"
                onClick={() => socket.emit("update_whitelist", { username: searchResults.name, updateType: "add" })}
              >
                Add {searchResults.name} to Whitelist
              </Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

