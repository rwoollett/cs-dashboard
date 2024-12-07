import React, { useState } from "react";
//import _ from 'lodash';
import { ActionByIp } from "../../types";

/**
 * Client Token activity on CSToken Network.
 * Show all network activity for clients connected  in the range of ports on network
 * 
 */
type ClientTokenProps = {
  range: {
    from: number;
    to: number;
  };
  clientsByIp: ActionByIp;
}

const ClientToken: React.FC<ClientTokenProps> = ({ range, clientsByIp}) => {
  const [clientActions, setClientActions] = useState<ActionByIp>(clientsByIp);
  const clientsList = Object.entries(clientActions).map(([ip, action] ) => {
    return (
      <div key={`${action.client.id}`} className="cell">
        <div className="panel-block">
          <p className="is-size-7 my-0"><span className="has-text-weight-light">Node IP: </span>{ip}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="panel">
      <p className="panel-heading">Client Token Activity</p>
      <div className="grid is-gap-0 is-col-min-6">
        {clientsList}
      </div>

    </div>
  );
}

export default ClientToken;