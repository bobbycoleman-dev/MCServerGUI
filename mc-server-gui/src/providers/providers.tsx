import { ThemeProvider } from "./theme-provider";
import { SocketProvider } from "./SocketContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </SocketProvider>
  );
}
