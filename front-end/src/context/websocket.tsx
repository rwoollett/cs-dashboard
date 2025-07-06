import { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { WebSocketClient } from "../client/wsock";
import { WSMessage } from "../types";

// type WSMessage =
//   | { subject: "clientCS_Connected"; payload: ConnectedClient }
//   | { subject: "clientCS_Disconnected"; payload: DisconnectedClient }
//   | { subject: "csToken_acquire"; payload: AcquireCS }
//   | { subject: "csToken_request"; payload: RequestCS };
//  | { subject: string; payload: Notification};

type WebSocketContextType = {
  wsRef: React.MutableRefObject<WebSocketClient | null>;
  lastMessage: WSMessage | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocketClient | null>(null);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);

  useEffect(() => {
    wsRef.current = websocketClient<WSMessage>(
      {
        queryParams: { type: "all" }, // or whatever fits your backend
        onMessage: (msg) => setLastMessage(msg),
        onDisconnect: () => { },
      },
      (client) => { wsRef.current = client; }
    );
    return () => wsRef.current?.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ wsRef, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;

