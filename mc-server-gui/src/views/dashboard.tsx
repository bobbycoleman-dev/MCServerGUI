import LogOutput from "../components/logOutput";
import LoggedOnUsers from "@/components/loggedOnUsers";

export default function Dashboard() {
  return (
    <div className="w-full h-full py-4 pl-4">
      <LogOutput key="logoutput" />
      <LoggedOnUsers />
    </div>
  )
}
