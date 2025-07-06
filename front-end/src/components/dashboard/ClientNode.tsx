import React, { useEffect, useRef, useState } from "react";
import { ClientCS, WSMessage } from "../../types";
import { parseISO, format } from 'date-fns';
import { useWebSocket } from "../../hooks/use-websocket-context";

type ClientNodeProps = {
  client: ClientCS;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const { lastMessage } = useWebSocket();
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(client.disconnectedAt || new Date().toISOString());

  // Queue to store incoming messages
  const messageQueue = useRef<WSMessage[]>([]);

  // State to trigger processing
  const [processTrigger, setProcessTrigger] = useState(0);

  // Push every new message into the queue
  useEffect(() => {
    if (!lastMessage) return;
    messageQueue.current.push(lastMessage);
    setProcessTrigger(trigger => trigger + 1);
  }, [lastMessage]);

  useEffect(() => {
    while (messageQueue.current.length > 0) {
      const msg = messageQueue.current.shift();
      if (msg && client.ip === msg.payload.sourceIp) {
        if (msg.subject === "clientCS_Connected") {
          setConnectedAt(msg.payload.connectedAt);
          setConnected(true);
        }
        if (msg.subject === "clientCS_Disconnected") {
          setDisconnectedAt(msg.payload.disconnectedAt);
          setConnected(false);
        }
      }
    }
  }, [processTrigger, client.ip]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title my-0 px-5">{client.name}</p>
      </header>
      <div className="card-content">
        <div className="media my-1">
          <div className="media-content">
            <p className="title is-7">{client.name}</p>
          </div>
        </div>
        <div className="content">
          <p className="is-size-7 my-1"><span className="has-text-weight-light">Node IP: </span>{client.ip}</p>
          <p className="is-size-7 my-0"><span className="has-text-weight-light">{!connected && 'Disconnected:'}{connected && 'Connected:'}<br /></span>
            <time>{connected && `${format(parseISO(connectedAt), 'P p')}`}{!connected && `${format(parseISO(disconnectedAt), 'P p')}`}</time>
          </p>
        </div>
      </div>
    </div >
  );
};

export default ClientNode;
