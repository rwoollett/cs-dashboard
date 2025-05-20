import { AcquireCs, Client, RequestCs } from "../graphql/generated/graphql-cstoken";

export type TokenAction = {
  parentIp: string;
  timestamp: string;
  originalIp: string;
  action: AcquireCs | RequestCs;
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

export type ActionByIp = Record<string, { client: Client; actions: TokenAction[]; }>;
