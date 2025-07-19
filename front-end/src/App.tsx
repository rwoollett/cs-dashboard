import React from 'react';
import MainPanel from './components/MainPanel';
import { UsersProvider } from './context/users';
import { WebSocketProvider } from "./context/websocket";
import Header from './components/Header';

const App: React.FC = () => {

  return (
    <UsersProvider>
      <WebSocketProvider>
        <section className="section">
          <div className="pt-0 container">
            <Header />
            <MainPanel />
          </div>
        </section >
      </WebSocketProvider>
    </UsersProvider>

  );
}

export default App;
