import React from "react";
import NetworkList from "./NetworkList";
import RequestToken from "./RequestToken";
import { Client, useGetClientsQuery } from "../../graphql/generated/graphql-cstoken";
import AcquireToken from "./AcquireToken";
import ClientToken from "./ClientToken";
import { ActionByIp } from "../../types";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const Dashboard: React.FC = () => {

  const range = { from: 5010, to: 5080 };
  const { data, loading } = useGetClientsQuery({
    variables: { range },
  });

  let networkContent = null;
  let clientContent = null;
  if (loading) {
    networkContent = (<div><p>Loading...</p></div>)
    clientContent = (<div><p>Loading...</p></div>)
  } else if (data) {
    networkContent = (<NetworkList clientList={data.getClients as Client[]} range={range} />);
    clientContent = (<ClientToken
      range={range}
      clientsByIp={(data.getClients as Client[]).reduce((prev: ActionByIp, client) => {
        prev[client.ip] = { client, actions: [] };
        return prev;
      }, {})} />);
  } else {
    networkContent = (<div><p>No network clients found.</p></div>)
    clientContent = (<div><p>No network clients found.</p></div>)
  }

  return (
    <div className="columns is-multiline">
      <div className="column is-full">
        {networkContent}
      </div>
      <div className="column is-full">
        {clientContent}
      </div>
      <div className="column">
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
      </div>
    </div>
  );

};

export default Dashboard;