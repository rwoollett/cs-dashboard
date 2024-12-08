import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { ActionByIp, TokenAction } from "../../types";
import { format, parseISO } from "date-fns";
import { Client, RequestCs, useRequestedCsTokenSubscription } from "../../graphql/generated/graphql-cstoken";

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

const ClientToken: React.FC<ClientTokenProps> = ({ range, clientsByIp }) => {
  const { loading, data: requestActivity, error: onFeedError } = useRequestedCsTokenSubscription();
  const [clientActions, setClientActions] = useState<ActionByIp>(clientsByIp);

  useEffect(() => {
    if (loading) { }
    else if (onFeedError) {
      console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);

    } else {
      if (requestActivity && requestActivity.requestCS_Created) {

        setClientActions((state) => {

          if (requestActivity && requestActivity.requestCS_Created && requestActivity.requestCS_Created.sourceIp) {

            const newState = {
              ..._.cloneDeep(state),
              [requestActivity.requestCS_Created.sourceIp]: {
                client: { ..._.cloneDeep(state[requestActivity.requestCS_Created.sourceIp].client as Client) },
                actions: [
                  {
                    parentIp: requestActivity.requestCS_Created.parentIp,
                    timestamp: requestActivity.requestCS_Created.requestedAt,
                    originalIp: requestActivity.requestCS_Created.originalIp,
                    action: requestActivity.requestCS_Created as RequestCs
                  } as TokenAction,
                  ..._.cloneDeep(state[requestActivity.requestCS_Created.sourceIp].actions.slice(0, 4))
                ]
              }
            } as ActionByIp;

            return newState;

          } else {

            return { ...state };
          }

        });
      }
    }
  }, [loading, onFeedError, requestActivity]);


  const clientsList = Object.entries(clientActions).map(([ip, action]) => {
    console.log(ip);

    const activity = action.actions.map((activity, index) => {
      console.log(activity);
      return (<div key={`${index}${ip}`} className="columns">
        <div className="column">
          <div className="mr-6">
            <label className="has-background-info-light px-1">Time stamp<br /></label>
            {`${format(parseISO(activity.timestamp), 'P hh:mm:ss:SSS ')}`}
          </div>
          <div className="cell mr-6 is-row-start-2">
            <label className="has-background-info-light px-1">Parent<br /></label>
            {activity.parentIp}
          </div>
        </div>
      </div>
      )
    });

    return (
      <tr key={`${action.client.id}`}>
        <td>
          {ip}
        </td>
        <td>
          {activity}
        </td>
      </tr>
    );
  });

  return (
    <div className="panel">
      <p className="panel-heading">Client Token Activity</p>
      <div className="panel-block">
        <table className="table">
          <thead>
            <tr>
              <th><p className="is-size-6 my-0"><span className="has-text-weight-light">Client IP</span></p></th>
              <th><p className="is-size-6 my-0"><span className="has-text-weight-light">Token Activity</span></p></th>
            </tr>
          </thead>
          <tbody>
            {clientsList}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientToken;