import React, { useEffect, useState } from "react";
import { Client, useConnectClientSubscription } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';

type ClientNodeProps = {
  client: Client;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const { loading, data, error } = useConnectClientSubscription({
    variables: { sourceIp: client.ip }
  });
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [connected, setConnected] = useState<boolean>(client.connected);
  useEffect(() => {
    if (data) {
      if (data.clientCS_Connected) {
        setConnectedAt(data.clientCS_Connected.connectedAt);
        setConnected(true);
      }
    }
  }, [loading, data, error])

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
          <br />
          <p className="is-size-7 my-0"><span className="has-text-weight-light">Connected: </span>
            <time>{connected && `${format(parseISO(connectedAt), 'P p')}`}</time>
            {!connected && 'No'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientNode;