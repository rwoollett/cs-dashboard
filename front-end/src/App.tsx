import React from 'react';
import MainPanel from './components/MainPanel';

function App() {
  const [data, setData] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <section className="section">
      <div className="pt-0 container">
        <header>
          <h1 className="title">
            Network Node Dashboard
          </h1>

        </header>
        <p>{!data ? "Loading..." : data}</p>
        <MainPanel />
      </div>

    </section >
  );
}

export default App;
