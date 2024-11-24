import React from "react";
import { Client } from "../../graphql/generated/graphql-cstoken";
import { GrSearch, GrBook } from "react-icons/gr";
import ClientNode from "./ClientNode";

/**
 * Network list.
 * Show all network node clients in the range of ports network
 * 
 */
type NetworkListProps = {
  clientList: Client[];
  range: {
    from: number;
    to: number;
  }
}

const NetworkList: React.FC<NetworkListProps> = ({ clientList, range }) => {

  const clientsList = clientList.map((client) => {
    return (
      <label key={`${client.id}`} className="panel-block">
        <span className="panel-icon">
          <GrBook />
        </span>
        <ClientNode client={client} />
      </label>
    );
  });


  return (
    <div className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <p className="columns is-multiline my-0">
          <p className="is-size-7 my-0 p-0 column is-full">Range of IP for network group is:</p>
          <p className="is-size-7 my-0 p-0 column  is-one-third"><span className="has-text-weight-light">From: </span>{range.from}</p>
          <p className="is-size-7 my-0 p-0 column is-one-third"><span className="has-text-weight-light">To: </span>{range.to}</p>
        </p>
      </div>
      <label className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </label>

      {clientsList}
    </div>
  );

};

export default NetworkList;