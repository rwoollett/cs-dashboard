import React, { useEffect, useState } from "react";
import _, { findLastIndex } from 'lodash';
import { ActionByIp, TokenAction } from "../../types";
import { format, parseISO } from "date-fns";
import { Client, RequestCs, RequestedCsTokenSubscription, RequestedCsTokenSubscriptionVariables, useRequestedCsTokenSubscription } from "../../graphql/generated/graphql-cstoken";
import { gql, TypedDocumentNode, useSubscription } from "@apollo/client";
import styles from './ClientToken.module.css'

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


// const { data, error, loading } = useSubscription(
//   query,
//   {
//     onData({ data }) {
//       setAccumulatedData((prev) => [...prev, data])
//     }
//   }
// );

const ClientToken: React.FC<ClientTokenProps> = ({ range, clientsByIp }) => {
  // const { loading, data: requestActivity, error: onFeedError } =
  //   useRequestedCsTokenSubscription();
  const REQUESTED_TOKEN: TypedDocumentNode<
  RequestedCsTokenSubscription, RequestedCsTokenSubscriptionVariables
> = gql`
subscription RequestedCSToken {
  requestCS_Created {
    sourceIp
    originalIp
    parentIp
    relayed
    requestedAt
  }
}
`;

  const [clientActions, setClientActions] = useState<ActionByIp>(clientsByIp);
  useSubscription(
    REQUESTED_TOKEN, {
    onData({ data }) {
      console.log(JSON.stringify(data))
      setClientActions((state) => {

        if (data.data && data.data?.requestCS_Created && data.data.requestCS_Created.sourceIp) {

          const newState = {
            ..._.cloneDeep(state),
            [data.data.requestCS_Created.sourceIp]: {
              client: { ..._.cloneDeep(state[data.data.requestCS_Created.sourceIp].client as Client) },
              actions: [..._.cloneDeep(state[data.data.requestCS_Created.sourceIp].actions),
              {
                parentIp: data.data.requestCS_Created.parentIp,
                timestamp: data.data.requestCS_Created.requestedAt,
                originalIp: data.data.requestCS_Created.originalIp,
                action: data.data.requestCS_Created as RequestCs
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
  });



  // useEffect(() => {
  //   if (loading) { }
  //   else if (onFeedError) {
  //     console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);

  //   } else {
  //     if (requestActivity && requestActivity.requestCS_Created) {

  //       setClientActions((state) => {

  //         if (requestActivity && requestActivity.requestCS_Created && requestActivity.requestCS_Created.sourceIp) {

  //           const newState = {
  //             ..._.cloneDeep(state),
  //             [requestActivity.requestCS_Created.sourceIp]: {
  //               client: { ..._.cloneDeep(state[requestActivity.requestCS_Created.sourceIp].client as Client) },
  //               actions: [..._.cloneDeep(state[requestActivity.requestCS_Created.sourceIp].actions),
  //               {
  //                 parentIp: requestActivity.requestCS_Created.parentIp,
  //                 timestamp: requestActivity.requestCS_Created.requestedAt,
  //                 originalIp: requestActivity.requestCS_Created.originalIp,
  //                 action: requestActivity.requestCS_Created as RequestCs
  //               } as TokenAction
  //               ].slice(-5)
  //             }
  //           } as ActionByIp;

  //           return newState;

  //         } else {

  //           return { ...state };
  //         }

  //       });
  //     }
  //   }
  // }, [loading, onFeedError, requestActivity]);


  const clientsList = Object.entries(clientActions).map(([ip, action]) => {
    console.log(ip);

    const activity = action.actions.map((activity, index) => {
      console.log(activity);
      return (
        <div key={`${index}${ip}`} className={styles.activityItem}>
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
          <div className={styles.flexActivity}>
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