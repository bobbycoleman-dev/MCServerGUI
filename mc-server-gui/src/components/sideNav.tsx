import { useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import { useSocket } from '../providers/SocketContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { Button } from './ui/button';
import { ConnectionOutput, ServerOutput } from '../lib/types';
import CountdownTimer from './ui/countdown';
import { BarChart3, LayoutDashboard, ListChecks, PackageOpen, Power, PowerOff, ServerCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function SideNav() {

  const [isConnected, setIsConnected] = useState(false);
  const [isServerRunning, setIsServerRunning] = useLocalStorage<boolean>("isServerRunning", false)
  const [startingServer, setStartingServer] = useState(false);
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


  }, [socket]);


  if (!socket) return null;
  return (
    <div className="w-[200px] border-r-2 h-full flex flex-col items-center pr-2 py-2 flex-shrink-0">
      {isConnected ? (
        <div className="flex flex-col gap-4 w-full items-center">
          <div> Connected to EC2</div>
          {isServerRunning ? (
            <Button variant="destructive" className="w-full flex gap-2 items-center" onClick={() => socket.emit("stop_server")}>
              <PowerOff /> Stop Server
            </Button>
          ) : (
            <Button
              disabled={startingServer}
              className="bg-green-500 w-full flex gap-2 items-center"
              onClick={() => socket.emit("start_server")}>
              <Power /> {startingServer ? "Starting Server..." : "Start Server"}
            </Button>

          )}
        </div>
      ) : (<div>Conection to EC2 failed</div>)
      }
      {startingServer && <CountdownTimer />}
      <div className="border-t-2 flex flex-col gap-8 mt-4 pt-4">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'flex gap-2 items-center text-green-500' : 'flex gap-2 items-center hover:text-green-400')}> <LayoutDashboard />Dashboard</NavLink>
        <NavLink to="/server-properties" className={({ isActive }) => (isActive ? 'flex gap-2 items-center text-green-500' : 'flex gap-2 items-center hover:text-green-400')}><ServerCog />Server Properties</NavLink>
        <NavLink to="/whitelist" className={({ isActive }) => (isActive ? 'flex gap-2 items-center text-green-500' : 'flex gap-2 items-center hover:text-green-400')}><ListChecks />Whitelist</NavLink>
        <NavLink to="/data-packs" className={({ isActive }) => (isActive ? 'flex gap-2 items-center text-green-500' : 'flex gap-2 items-center hover:text-green-400')}><PackageOpen />Data Packs</NavLink>
        <NavLink to="/ec2-stats" className={({ isActive }) => (isActive ? 'flex gap-2 items-center text-green-500' : 'flex gap-2 items-center hover:text-green-400')}><BarChart3 />EC2 Stats</NavLink>
      </div>
    </div >
  )
}
