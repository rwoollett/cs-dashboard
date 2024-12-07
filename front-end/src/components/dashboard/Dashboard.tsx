import React from "react";
import NetworkList from "./NetworkList";
import RequestToken from "./RequestToken";
import { Client, useGetClientsQuery } from "../../graphql/generated/graphql-cstoken";
import AcquireToken from "./AcquireToken";
import ClientToken from "./ClientToken";

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
  if (loading) {
    networkContent = (<div><p>Loading...</p></div>)
  } else if (data) {
    networkContent = (<NetworkList clientList={data.getClients as Client[]} range={range} />);
  } else {
    networkContent = (<div><p>No network clients found.</p></div>)
  }

  return (
    <div className="columns is-multiline">
      <div className="column is-full">
        {networkContent}
      </div>
      <div className="column is-full">
        <ClientToken />
      </div>
      <div className="column">
        <div className="fixed-grid has-3-cols has-1-cols-mobile">
          <div className="grid is-gap-2">
            {/* <div className="cell is-row-start-1 is-col-span-6">
              <ClientToken />
            </div> */}
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