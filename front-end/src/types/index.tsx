import { ClientCS, AcquireCS, RequestCS } from "./cstoken";

export * from "./cstoken";

export type TokenAction = {
  parentIp: string;
  timestamp: string;
  originalIp: string;
  action: AcquireCS | RequestCS;
}

export interface Notification {
  id: string;
  name: string;
  date: string;
  user: string;
  message: string;
  isNew: boolean;
  read: boolean;
}

export type ActionByIp = Record<string, { client: ClientCS; actions: TokenAction[]; }>;
