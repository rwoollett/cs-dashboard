import { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { WebSocketClient } from "../client/wsock";

type WSMessage = { subject: string; payload: any };

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
        onDisconnect: () => {},
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

