import React, { useEffect, useState } from "react";
import { Client, useConnectClientSubscription, useDisconnectClientSubscription } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';

type ClientNodeProps = {
  client: Client;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const { loading, data, error } = useConnectClientSubscription({
    variables: { sourceIp: client.ip }
  });
  const { loading: dcLoading, data: dcData, error: dcError } = useDisconnectClientSubscription({
    variables: { sourceIp: client.ip }
  });
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(client.disconnectedAt);

  useEffect(() => {
    if (data) {
      if (data.clientCS_Connected) {
        setConnectedAt(data.clientCS_Connected.connectedAt);
        setConnected(true);
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (dcData) {
      if (dcData.clientCS_Disconnected) {
        setDisconnectedAt(dcData.clientCS_Disconnected.disconnectedAt);
        setConnected(false);
      }
    }
  }, [dcLoading, dcData, dcError])

  return (
    <div className="card">
      {/* <header className="card-header">
        <p className="card-header-title my-0 px-5">{client.name}</p>
      </header> */}
      <div className="card-content">
        <div className="media my-1">
          <div className="media-content">
            <p className="title is-7">{client.name}</p>
          </div>
        </div>
        <div className="content">
          <p className="is-size-7 my-0"><span className="has-text-weight-light">Node IP: </span>{client.ip}</p>
          <p className="is-size-7 my-0"><span className="has-text-weight-light">Connected: </span>
            <time>{connected && `${format(parseISO(connectedAt), 'P p')}`}</time>
            {!connected && 'No'}
          </p>
        </div>
      </div>
    </div >
  );
};

export default ClientNode;