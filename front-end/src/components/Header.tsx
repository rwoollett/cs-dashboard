import React, { useEffect, useRef, useState } from 'react'
import useUsersContext from '../hooks/use-users-context';
import { User } from '../context/User';
import { useWebSocket } from '../hooks/use-websocket-context';

const Header: React.FC = () => {
  const { user, signOut } = useUsersContext();
  const { wsRef, messageQueue } = useWebSocket();
  const [connected, setConnected] = useState(wsRef.current?.client !== undefined);
  const [received, setReceived] = useState<string[]>([]);
  const latestTimestamp = 'something';
  const lastProcessedSeq = useRef(0);

  const handleSendMessage = () => {
    const { payload } = { payload: latestTimestamp };
    if (wsRef.current && connected) {
      wsRef.current.send({ payload });
    } else {
      console.log('WebSocket is not connected');
    }
  };

  useEffect(() => {
    for (const { seq, msg } of messageQueue) {
      if (seq > lastProcessedSeq.current) {
        setConnected(true);
        setReceived(prev => {
          return [...prev].concat(msg.payload as unknown as string);
        });
        lastProcessedSeq.current = seq;
      }
    }
  }, [messageQueue]);

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

