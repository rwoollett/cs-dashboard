import React from "react";
import NetworkList from "./NetworkList";
import AcquireToken from "./AcquireToken";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const Dashboard: React.FC = () => {

  return (
    <div className="columns">
      <div className="column is-two-fifths">
        <NetworkList/>
      </div>
      <div className="column">
        <AcquireToken/>
      </div>
    </div>
  );

};

export default Dashboard;