import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../providers/SocketContext';

type DataItem = string

export default function LogOutput() {
  const [output, setOutput] = useState<Set<DataItem>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (!socket) return;
    socket.on("log_output", (data: string) => {

      const lines = data.split("\n");

      lines.forEach(line => {
        setOutput(prev => {
          const newSet = new Set(prev);
          newSet.add(line);
          return newSet;
        })
      })

    });
  }, [socket])

  return (
    <div ref={ref} className="w-full h-[450px] overflow-y-scroll border">
      {Array.from(output).map((log, i) => (
        <p key={i} className="text-sm mb-1">
          {log}
        </p>
      ))}
    </div>
  )
}
