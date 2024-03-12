import { useEffect, useRef } from 'react';
import { useSocket } from '../providers/SocketContext';
import { useStore } from '@/lib/store';

export default function LogOutput() {
  const logEntries = useStore((state: any) => Array.from(state.logEntries))
  const addLogEntry = useStore((state: any) => state.addLogEntry)
  const ref = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logEntries]);

  useEffect(() => {
    if (!socket) return;
    socket.on("log_output", (data: string) => {

      const lines = data.split("\n");

      lines.forEach(line => {
        if (!line.trim()) return
        addLogEntry(line)
      })

    });
  }, [socket])

  return (
    <div ref={ref} className="min-w-full p-2 h-[450px] overflow-y-scroll border">
      {logEntries.map((log: any, i) => (
        <p key={i} className="text-sm mb-1">
          <span className="text-green-500">{`-> `}</span> {log}
        </p>
      ))}
    </div>
  )
}
