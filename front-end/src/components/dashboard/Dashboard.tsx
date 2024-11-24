import React from "react";
import NetworkList from "./NetworkList";
import AcquireToken from "./RequestToken";
import { Client, useGetClientsQuery } from "../../graphql/generated/graphql-cstoken";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const Dashboard: React.FC = () => {

  const range = { from: 5010, to: 5080};
  const { data, loading } = useGetClientsQuery({
    variables: { range }
  });

  let networkContent = null;
  if (loading) {
    networkContent = (<div><p>Loading...</p></div>)
  } else if (data) {
    console.log('dashboard',data);
    networkContent = (<NetworkList clientList={data.getClients as Client[]} range={range} />);
  } else {
    networkContent = (<div><p>No network clients found.</p></div>)
  }

  return (
    <div className="columns">
      <div className="column is-two-fifths">
        {networkContent}
      </div>
      <div className="column">
        <AcquireToken />
      </div>
    </div>
  );

};

export default Dashboard;