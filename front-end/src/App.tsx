import React from 'react';
import MainPanel from './components/MainPanel';
import { ApolloProvider } from '@apollo/client';
import createApolloClient from './client/apollo';
import { UsersProvider } from './context/users';
import useUsersContext from './hooks/use-users-context';


const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useUsersContext();
  const client = createApolloClient(token); // Pass the token to the Apollo Client
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function App() {
  return (
    <UsersProvider>
      <ApolloClientProvider>
        <section className="section">
          <div className="pt-0 container">
            <header>
              <h1 className="title">
                Network with NMToken Dashboard
              </h1>
            </header>
            {/* <p>{!data ? "Loading..." : data}</p> */}
            <MainPanel />
          </div>

        </section >
      </ApolloClientProvider>
    </UsersProvider>

  );
}

export default App;
