export type ConnectionOutput = {
  message: string;
  isConnected: boolean;
};

export type ServerOutput = {
  message: string;
  data?: string;
  isRunning: boolean;
};
