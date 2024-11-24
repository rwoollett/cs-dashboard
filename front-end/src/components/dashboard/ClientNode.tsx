import React from "react";
import { Client } from "../../graphql/generated/graphql-cstoken";

type ClientNodeProps = {
  client: Client;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  return (
    <div className="card">
      {/* <header className="card-header">
        <p className="card-header-title my-0 px-5">{client.name}</p>
      </header> */}
      <div className="card-content">
        <div className="media my-3">
          <div className="media-content">
            <p className="title is-5">{client.name}</p>
          </div>
        </div>
        <div className="content">
          <p className="is-size-6 my-0"><span className="has-text-weight-light">Node IP: </span>{client.ip}</p>
          <p className="is-size-6 my-0"><span className="has-text-weight-light">Parent IP: </span>{client.requestParent.clientIp}</p>
          <p className="is-size-6 my-0"><span className="has-text-weight-light">Status: </span>Not connected</p>
          {/* <br /> */}
          {/* <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time> */}
        </div>
      </div>
    </div>
  );
};

export default ClientNode;