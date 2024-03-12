import { useEffect, useState } from "react";
import { useToast } from "../components/ui/use-toast";
import { useSocket } from "../providers/SocketContext";
import { userLoggedOff, userLoggedOn } from "../lib/utils";
import LogOutput from "../components/logOutput";
export default function Dashboard() {

  const [loggedOnUsers, setLoggedOnUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const socket = useSocket();


  useEffect(() => {
    if (!socket) return;

    socket.on("log_output", (data: string) => {

      const lines = data.split("\n");

      lines.forEach(line => {
        if (!line.trim()) return

        const loggedOnUser = userLoggedOn(line);
        const loggedOffUser = userLoggedOff(line);

        if (loggedOffUser) {
          setLoggedOnUsers((prev) => prev.filter((user) => user !== loggedOffUser));

          toast({
            variant: "destructive",
            title: "User Logged Off",
            description: `${loggedOffUser} has logged off`
          });
        } else if (loggedOnUser) {
          setLoggedOnUsers((prev) => {
            if (prev.includes(loggedOnUser)) {
              return prev;
            }
            return [...prev, loggedOnUser];
          });

          toast({
            variant: "success",
            title: "User Logged On",
            description: `${loggedOnUser} has logged on`
          });
        }
      })

    });

  }, [socket]);


  if (!socket) return null;
  return (

    <div className="w-full h-full py-4 pl-4">
      <LogOutput key="logoutput" />
      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Logged On Users</h2>
        {loggedOnUsers.length === 0 && <p>No users logged on</p>}
        {loggedOnUsers.map((user, i) => (
          <p className="flex gap-2 items-center border p-2 max-w-fit rounded-md" key={i}><img className="h-10" src={`https://mc-heads.net/avatar/${user}`} alt="" />{user}</p>
        ))}
      </div>
    </div>
  )
}
