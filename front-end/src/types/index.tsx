import { AcquireCs, Client, RequestCs } from "../graphql/generated/graphql-cstoken";

export type TokenAction = {
  parentIp: string;
  timestamp: string;
  originalIp: string;
  action: AcquireCs | RequestCs;
}

export type ActionByIp = Record<string, { client: Client; actions: TokenAction[]; }>;
