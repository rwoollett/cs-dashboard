import React from 'react';
import MainPanel from './components/MainPanel';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './client/apollo';

function App() {
  // const [data, setData] = React.useState<string | null>(null);
  
  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <ApolloProvider client={apolloClient}>
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
    </ApolloProvider>

  );
}

export default App;
