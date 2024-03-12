export type ConnectionOutput = {
  message: string;
  isConnected: boolean;
};

export type ServerOutput = {
  message: string;
  data?: string;
  isRunning: boolean;
};

export type ServerProperties = {
  allowFlight: boolean;
  allowNether: boolean;
  broadcastConsoleToOps: boolean;
  difficulty: string;
  enableCommandBlock: boolean;
  enableQuery: boolean;
  enableRcon: boolean;
  forceGamemode: boolean;
  gamemode: number;
  generateStructures: boolean;
  generatorSettings: string;
  hardcore: boolean;
  levelName: string;
  levelSeed: string;
  levelType: string;
  maxBuildHeight: number;
  maxPlayers: number;
  maxTickTime: number;
  maxWorldSize: number;
  motd: string;
  networkCompressionThreshold: number;
  onlineMode: boolean;
  opPermissionLevel: number;
  playerIdleTimeout: number;
  preventProxyConnections: boolean;
  pvp: boolean;
  queryPort: number;
  rateLimit: number;
  rconPassword: string;
  rconPort: number;
  resourcePack: string;
  resourcePackHash: string;
  serverIp: string;
  serverPort: number;
  spawnAnimals: boolean;
  spawnMonsters: boolean;
  spawnNpcs: boolean;
  spawnProtection: number;
  useNativeTransport: boolean;
  viewDistance: number;
  whiteList: boolean;
};

