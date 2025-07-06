import { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { WebSocketClient } from "../client/wsock";
import { WSMessage } from "../types";
import _ from 'lodash';

type WebSocketContextType = {
  wsRef: React.MutableRefObject<WebSocketClient | null>;
  messageQueue: { seq: number, msg: WSMessage }[];
};

const MSG_QUEUE_MAX = 150;
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocketClient | null>(null);
  const [messageQueue, setMessageQueue] = useState<{ seq: number, msg: WSMessage }[]>([]);
  const [, setSeq] = useState(0);

  useEffect(() => {
    wsRef.current = websocketClient<WSMessage>(
      {
        queryParams: { type: "all" },
        onMessage: (msg) => {
          setSeq(prevSeq => {
            const nextSeq = prevSeq + 1;
            setMessageQueue(
              q => [..._.cloneDeep(q), { seq: nextSeq, msg }]
                .slice(-MSG_QUEUE_MAX)
            );
            return nextSeq;
          });
        },
        onDisconnect: () => { },
      },
      (client) => { wsRef.current = client; }
    );
    return () => wsRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebSocketContext.Provider value={{ wsRef, messageQueue }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;

