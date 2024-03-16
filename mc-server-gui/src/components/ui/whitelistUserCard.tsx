import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { Button } from "./button";
import { useSocket } from "@/providers/SocketContext";

type WhitelistUserCardProps = {
  uuid: string;
  name: string;
  size: "sm" | "md" | "lg";
  displayOnly?: boolean;
}

export default function WhitelistUserCard({ uuid, name, size, displayOnly }: WhitelistUserCardProps) {
  const socket = useSocket()
  const sizeVarients = {
    sm: "h-[150px] w-[150px]",
    md: "h-[250px] w-[250px]",
    lg: "h-[300px] w-[300px]",
  }

  if (!socket) return

  return (
    <Card className={`${sizeVarients[size]} flex-shrink-0 relative`}>
      <CardContent className="flex flex-col gap-2 items-center pt-4">
        <img src={`https://mc-heads.net/head/${uuid}/160`} alt={name} className="" />
        <p className={`${size == "sm" ? 'text-sm' : 'text-xl'} text-gray-300`}>{name}</p>
      </CardContent>
      {!displayOnly &&
        <Button
          className="absolute top-1 right-1"
          variant="ghost"
          onClick={() => socket.emit("update_whitelist", { username: name, updateType: "remove" })}
        >
          <UserX className=" text-red-500" size={24} />
        </Button>
      }
    </Card >
  )
}

