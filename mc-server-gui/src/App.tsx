import { useEffect, useState } from "react";
import { useToast } from "./components/ui/use-toast";
import { userLoggedOff, userLoggedOn } from "./lib/utils";
import { useSocket } from "./providers/SocketContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import CountdownTimer from "./components/ui/countdown";

import { ConnectionOutput, ServerOutput } from "./lib/types";
import LogOutput from "./components/logOutput";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isServerRunning, setIsServerRunning] = useLocalStorage<boolean>("isServerRunning", false)
  const [startingServer, setStartingServer] = useState(false);
  const [loggedOnUsers, setLoggedOnUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const socket = useSocket();


  useEffect(() => {
    if (!socket) return;

    socket.on("connection_output", (data: ConnectionOutput) => {
      setIsConnected(data.isConnected);
      if (data.isConnected) {
        if (isServerRunning) {
          socket.emit("server_status");
        }
        toast({
          variant: "success",
          title: "EC2 Connection Status",
          description: data.message
        });
      } else {
        toast({
          variant: "destructive",
          title: "EC2 Connection Status",
          description: data.message
        });
      }
    });

    socket.on("start_stop_output", (data: ServerOutput) => {
      if (data.isRunning) {
        setStartingServer(true);
        setTimeout(() => {
          setStartingServer(false);
          setIsServerRunning(data.isRunning);
          toast({
            variant: "success",
            title: "Minecraft Server Status",
            description: data.message
          });
        }, 1000 * 30);
      } else {
        setIsServerRunning(data.isRunning);
        toast({
          variant: "destructive",
          title: "Minecraft Server Status",
          description: data.message
        });
      }
    });

    socket.on("log_output", (data: string) => {
      const loggedOnUser = userLoggedOn(data);
      const loggedOffUser = userLoggedOff(data);
      if (loggedOffUser) {
        setLoggedOnUsers((prev) => prev.filter((user) => user !== loggedOffUser));
      }
      if (loggedOnUser) {
        setLoggedOnUsers((prev) => {
          if (prev.includes(loggedOnUser)) {
            return prev;
          }
          return [...prev, loggedOnUser];
        });
      }
    });

  }, [socket]);


  if (!socket) return null;

  return (
    <div className="container py-4 relative h-dvh w-full flex justify-between items-center">
      <div className="absolute bottom-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-1/4 border-r-2 h-full flex flex-col items-center p-4 flex-shrink-0 min-w-[200px]">
        {isConnected ? (
          <div className="flex flex-col gap-4">
            <div> Connected to EC2</div>
            {isServerRunning ? (
              <Button variant="destructive" onClick={() => socket.emit("stop_server")}>
                Stop Server
              </Button>
            ) : (
              <Button
                disabled={startingServer}
                className="bg-green-500"
                onClick={() => socket.emit("start_server")}>
                {startingServer ? "Starting Server..." : "Start Server"}
              </Button>
            )}
          </div>
        ) : (
          <div>Conection to EC2 failed</div>)}
      </div>

      <div className="w-3/4 h-full pl-4">
        {startingServer && <CountdownTimer />}
        <LogOutput />
        <div className="mt-4 flex flex-col gap-2">
          <h2 className="text-lg font-bold">Logged On Users</h2>
          {loggedOnUsers.length === 0 && <p>No users logged on</p>}
          {loggedOnUsers.map((user, i) => (
            <p key={i}>{user}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
