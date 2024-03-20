import CommandInput from "@/components/commandInput";
import LogOutput from "../components/logOutput";
import LoggedOnUsers from "@/components/loggedOnUsers";

export default function Dashboard() {
  return (
    <div className="w-full h-full py-4 pl-4">
      <LogOutput />
      <CommandInput />
      <LoggedOnUsers />
      <div><a href="https://mcseedmap.net/1.20.1-Java/2725214931529352700" target="_blank">Seed Map</a></div>
    </div>
  )
}
