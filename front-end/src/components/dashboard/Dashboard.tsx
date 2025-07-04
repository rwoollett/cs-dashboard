import React, { useEffect, useState } from "react";
import NetworkList from "./NetworkList";
import { ClientCS } from "../../types";
import ClientToken from "./ClientToken";
import { ActionByIp } from "../../types";
import SignIn from "./Signin";
import useUsersContext from "../../hooks/use-users-context";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */

/**
 * Network list.  
 * Show all network node clients in the range of ports network
 * 
 */

const Dashboard: React.FC = () => {
  const { user } = useUsersContext();
  const range = { from: 7010, to: 7040 };

  const [data, setData] = useState<{ getClients: ClientCS[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3003/api/v1/clients/range/${range.from}/${range.to}`)
      .then(res => res.json())
      .then(json => {
        console.log("Fetched clients:", json);
        if (!json || !Array.isArray(json.getClients)) {
          throw new Error("Invalid response format");
        }
        setData({ getClients: json.getClients });
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [range.from, range.to]);

  let networkContent = null;
  let clientContent = null;
  if (loading) {
    networkContent = (<div><p>Loading...</p></div>)
    clientContent = (<div><p>Loading...</p></div>)
  } else if (data) {
    networkContent = (<NetworkList
      clientList={data.getClients as ClientCS[]}
      range={range} />);
    clientContent = (<ClientToken
      range={range}
      clientsByIp={(data.getClients as ClientCS[]).reduce((prev: ActionByIp, client) => {
        prev[client.ip] = { client, actions: [] };
        return prev;
      }, {})} />);
  } else {
    networkContent = (<div><p>No network clients found.</p></div>)
    clientContent = (<div><p>No network clients found.</p></div>)
  }

  let dashboardContent = null;
  if (user) {
    dashboardContent = (<>
      <div className="column is-full">
        {networkContent}
      </div>
      <div className="column is-full">
        {clientContent}
      </div>
      {/* <div className="column">
      <div className="fixed-grid has-3-cols has-1-cols-mobile">
        <div className="grid is-gap-2">
          <div className="cell">
            <RequestToken />
          </div>
          <div className="cell">
            <AcquireToken />
          </div>
        </div>
      </div>
      </div>*/}

    </>
    );
  } else {
    dashboardContent = (
      <div>
        <SignIn />
      </div>
    )
  }
  return (
    <div className="columns is-multiline">
      {dashboardContent}
    </div>
  );

};

export default Dashboard;