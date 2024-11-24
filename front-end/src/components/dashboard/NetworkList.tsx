import React from "react";
import { Client } from "../../graphql/generated/graphql-cstoken";
import { GrSearch, GrBook } from "react-icons/gr";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
type NetworkListProps = {
  clientList: Client[];
}

const NetworkList: React.FC<NetworkListProps> = ({ clientList }) => {

  const clientsList = clientList.map((node) => {
    return (
      <div key={`${node.id}`} className="panel-block is-active">
        <span className="panel-icon">
          <GrBook />
        </span>
        {node.name}
      </div>
    );
  });


  return (
    <nav className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </div>
      
      {clientsList}
    </nav>
  );

};

export default NetworkList;