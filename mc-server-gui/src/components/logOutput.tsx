import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../providers/SocketContext';

type DataItem = string

export default function LogOutput() {
  const [output, setOutput] = useState<DataItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref]);

  useEffect(() => {
    if (!socket) return;
    socket.on("log_output", (data: string) => {
      setOutput((prev) => [...prev, data]);
    });
  }, [socket])

  return (
    <div ref={ref} className="w-full h-[450px] overflow-y-scroll border">
      {output.map((log, i) => (
        <p key={i} className="text-sm">
          {log}
        </p>
      ))}
    </div>
  )
}
