import React, { useEffect, useState } from "react";
import _, { findLastIndex } from 'lodash';
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

  const flexActivity = {
    display: "flex",
    padding: "0px",
    margin: "0px",
    width: "fit-content",
    "justify-content": "space-around",
    "align-items": "flex-start",
    "flex-direction": "row",
  };

  const activityItem = {
    margin: "0 5px",
    padding: "4px",
    width: "110px",
    color: "rgba(0, 0, 0, 0.75)",
    background: "white",
    "text-align": "left",
    border: "1px solid rgb(51, 51, 51)",
    "border-radius": "5px",
    "box-shadow": "0px 0px 5px rgba(0, 0, 0, 0.2)",
  }

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
                actions: [..._.cloneDeep(state[requestActivity.requestCS_Created.sourceIp].actions),
                {
                  parentIp: requestActivity.requestCS_Created.parentIp,
                  timestamp: requestActivity.requestCS_Created.requestedAt,
                  originalIp: requestActivity.requestCS_Created.originalIp,
                  action: requestActivity.requestCS_Created as RequestCs
                } as TokenAction
                ].slice(-5)
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
      return (
        <div key={`${index}${ip}`} style={activityItem}>
          <div className="ml-2 is-size-7">
            <label className="has-background-info-light px-1 ">Time stamp<br /></label>
            {`${format(parseISO(activity.timestamp), 'P hh:mm:ss:SSS ')}`}
          </div>
          <div className="ml-2 mt-2 is-size-7">
            <label className="has-background-info-light px-1">Parent<br /></label>
            {activity.parentIp}
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
          <div style={flexActivity}>
            {activity}
          </div>
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