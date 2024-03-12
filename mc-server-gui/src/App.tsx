import { ModeToggle } from "./components/mode-toggle";
import SideNav from "./components/sideNav";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className=" px-4 relative h-dvh w-full flex justify-between items-center">
      <div className="absolute bottom-4 left-4">
        <ModeToggle />
      </div>
      <SideNav />
      <Outlet />
    </div>
  );
}

export default App;
