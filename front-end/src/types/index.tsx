import { ClientCS, AcquireCS, RequestCS } from "./cstoken";
import { Game } from "./ttt";

export * from "./cstoken";
export * from "./ttt";

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


export function isGame(obj: any): obj is Game {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.board === "string" &&
    typeof obj.createdAt === "string"
  );
}
export type CreateGameMutationVariables = {
  userId: string;
};

export type StartGameMutationVariables = {
  gameId: string;
};

export type BoardMoveMutationVariables = {
  gameId: string;
  isOpponentStart: boolean;
  moveCell: number;
  player: number;
};

export type GameUpdateByGameIdSubscriptionVariables = {
  gameId: string;
};


