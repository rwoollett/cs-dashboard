import React, { useEffect, useRef, useState } from 'react'
import useUsersContext from '../hooks/use-users-context';
import { User } from '../context/User';
import websocketClient, { WebSocketClient } from '../client/wsock';
import { Notification } from '../types';

const Header: React.FC = () => {
  const { user, signOut } = useUsersContext();
  const webSocket = useRef<WebSocketClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [received, setReceived] = useState<Notification[]>([]);

  const latestTimestamp = '';

  const handleSendMessage = () => {
    const { payload } = { payload: latestTimestamp };
    if (webSocket.current && connected) {
      webSocket.current.send({ payload });
    } else {
      console.log('WebSocket is not connected');
    }
  };

  useEffect(() => {
    websocketClient<{ type: string; payload: Notification[] }>(
      {
        queryParams: {
          type: "fetch_since",
          user: "sender"
        },
        onMessage: (message) => {
          setReceived(prev => {
            return [...prev].concat(message.payload);
          });
        },
        onDisconnect: () => {
          setConnected(false);
        },
      },
      (websocketClient) => {
        setConnected(true);
        webSocket.current = websocketClient;
      }
    );
  }, []);

  return (
    <header>
      <h1 className="title">
        Network with NMToken Dashboard
      </h1>
      {user && (
        <div className='mb-2 columns has-background-info-light'>
          <div className="column is-narrow">
            <div className="is-size-6">Welcome, <b>{user && (user as User).name}</b>!</div>
          </div>
          <div className="column">
            <button type="button" className="tag is-link" onClick={signOut}>Log out</button>
          </div>
          <div className="column is-narrow">
              <span className={`tag ${connected ? 'is-success' : 'is-danger'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="column">
            <button type="button" className="tag is-link" onClick={handleSendMessage}>Send</button>
          </div>
          <div className="column is-narrow">
            <span className={`tag ${received.length > 0 ? 'is-warning' : 'is-info'}`}>
              {received.length > 0 ? `Received ${received.length} notifications` : 'No new notifications'}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header;

