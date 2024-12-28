import React, { useEffect, useState } from "react";
import { Client, useConnectClientSubscription, useDisconnectClientSubscription } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';

type ClientNodeProps = {
  client: Client;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const { data } = useConnectClientSubscription({
    variables: { sourceIp: client.ip }
  });
  const { data: dcData } = useDisconnectClientSubscription({
    variables: { sourceIp: client.ip }
  });
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(client.disconnectedAt);

  useEffect(() => {
    if (data?.clientCS_Connected) {
      setConnectedAt(data.clientCS_Connected.connectedAt);
      setConnected(true);
    }
  }, [data])

  useEffect(() => {
    if (dcData?.clientCS_Disconnected) {
      setDisconnectedAt(dcData.clientCS_Disconnected.disconnectedAt);
      setConnected(false);
    }
  }, [dcData])

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title my-0 px-5">{client.name}</p>
      </header>
      <div className="card-content">
        <div className="media my-1">
          <div className="media-content">
            <p className="title is-7">{client.name}</p>
          </div>
        </div>
        <div className="content">
          <p className="is-size-7 my-1"><span className="has-text-weight-light">Node IP: </span>{client.ip}</p>
          <p className="is-size-7 my-0"><span className="has-text-weight-light">{!connected && 'Disconnected:'}{connected && 'Connected:'}<br /></span>
            <time>{connected && `${format(parseISO(connectedAt), 'P p')}`}{!connected && `${format(parseISO(disconnectedAt), 'P p')}`}</time>
          </p>
        </div>
      </div>
    </div >
  );
};

export default ClientNode;