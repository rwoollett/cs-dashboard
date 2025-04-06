import React from "react";
import NetworkList from "./NetworkList";
import { Client, useGetClientsQuery } from "../../graphql/generated/graphql-cstoken";
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
// type DashboardProps = {
//   hasAuthenticated: boolean;
// }

const Dashboard: React.FC = () => {
  const { user } = useUsersContext();
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
    networkContent = (<NetworkList
      clientList={data.getClients as Client[]}
      range={range} />);
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