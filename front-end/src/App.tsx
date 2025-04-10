import React from 'react';
import MainPanel from './components/MainPanel';
import { ApolloProvider } from '@apollo/client';
import createApolloClient from './client/apollo';
import { UsersProvider } from './context/users';
import useUsersContext from './hooks/use-users-context';
import Header from './components/Header';


const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useUsersContext();
  const [client, setClient] = React.useState<any>(null);

  React.useEffect(() => {
    const initializeClient = async () => {
      const token = await getToken();
      console.log('clientProvider token', token);
      const apolloClient = createApolloClient(token); // Pass the token to the Apollo Client
      setClient(apolloClient);
    };
    initializeClient();
  }, [getToken]);

  if (!client) {
    return <div>Loading...</div>; // Render a loading state while the client is being initialized
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const App: React.FC = () => {

  return (
    <UsersProvider>
      <ApolloClientProvider>
        <section className="section">
          <div className="pt-0 container">
            <Header />
            {/* <p>{!data ? "Loading..." : data}</p> */}
            <MainPanel />
          </div>
        </section >
      </ApolloClientProvider>
    </UsersProvider>

  );
}

export default App;
