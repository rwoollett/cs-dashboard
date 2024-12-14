import React, { useState } from "react";
import _ from 'lodash';
import { ActionByIp, TokenAction } from "../../types";
import { format, parseISO } from "date-fns";
import {
  Client, RequestCs, AcquireCs,
  AcquiredCsTokenSubscription,
  AcquiredCsTokenSubscriptionVariables,
  RequestedCsTokenSubscription,
  RequestedCsTokenSubscriptionVariables
} from "../../graphql/generated/graphql-cstoken";
import { gql, useSubscription, TypedDocumentNode } from "@apollo/client";
import styles from './ClientToken.module.css'

/**
 * Client Token activity on CSToken Network.
 * Show all network activity for clients connected in the range of ports on network
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
  const REQUESTED_TOKEN: TypedDocumentNode<RequestedCsTokenSubscription, RequestedCsTokenSubscriptionVariables> = gql`
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

  const ACQUIRED_TOKEN: TypedDocumentNode<AcquiredCsTokenSubscription, AcquiredCsTokenSubscriptionVariables> = gql`
      subscription AcquiredCSToken {
        acquireCS_Created {
          ip
          sourceIp
          acquiredAt
        }
      }
    `;

  const [clientActions, setClientActions] = useState<ActionByIp>(clientsByIp);
  const [lastActivity, setLastActivity] = useState<TokenAction | undefined>(undefined);

  useSubscription(
    REQUESTED_TOKEN, {
    onData({ data }) {

      setLastActivity(() => {
        if (data.data && data.data?.requestCS_Created && data.data.requestCS_Created.sourceIp) {
          return {
            parentIp: data.data.requestCS_Created.parentIp,
            timestamp: data.data.requestCS_Created.requestedAt,
            originalIp: data.data.requestCS_Created.originalIp,
            action: data.data.requestCS_Created as RequestCs
          } as TokenAction
        }
      });

      setClientActions((state) => {
        if (data.data && data.data?.requestCS_Created && data.data.requestCS_Created.sourceIp) {

          let clientForActivityIP: string = "";
          if (data.data.requestCS_Created.originalIp === data.data.requestCS_Created.sourceIp) {
            clientForActivityIP = data.data.requestCS_Created.sourceIp;
          } else {
            clientForActivityIP = data.data.requestCS_Created.originalIp;
          }

          const newState = {
            ..._.cloneDeep(state),
            [clientForActivityIP]: {
              client: { ..._.cloneDeep(state[clientForActivityIP].client as Client) },
              actions: [..._.cloneDeep(state[clientForActivityIP].actions),
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

  useSubscription(
    ACQUIRED_TOKEN, {
    onData({ data }) {

      setLastActivity(() => {
        if (data.data && data.data?.acquireCS_Created && data.data.acquireCS_Created.ip) {
          return {
            parentIp: data.data.acquireCS_Created.sourceIp,
            timestamp: data.data.acquireCS_Created.acquiredAt,
            originalIp: data.data.acquireCS_Created.ip,
            action: data.data.acquireCS_Created as AcquireCs
          } as TokenAction
        }
      });

      setClientActions((state) => {
        if (data.data && data.data?.acquireCS_Created && data.data.acquireCS_Created.ip) {

          let clientForActivityIP: string = data.data.acquireCS_Created.ip;

          const newState = {
            ..._.cloneDeep(state),
            [clientForActivityIP]: {
              client: { ..._.cloneDeep(state[clientForActivityIP].client as Client) },
              actions: [..._.cloneDeep(state[clientForActivityIP].actions),
              {
                parentIp: data.data.acquireCS_Created.sourceIp,
                timestamp: data.data.acquireCS_Created.acquiredAt,
                originalIp: data.data.acquireCS_Created.ip,
                action: data.data.acquireCS_Created as AcquireCs
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

  const clientsList = Object.entries(clientActions).map(([ip, action]) => {
    const activity = action.actions.map((activity, index) => {

      // Highlight last activity in the table of client token activity.
      let highlighted: string = "";
      if (lastActivity && (lastActivity?.timestamp === activity.timestamp)) {
        highlighted = styles.highlightedItem;
      } else {
        highlighted = styles.unhighlightedItem;
      }

      let backgroundItem: string = "";
      switch (activity.action.__typename) {
        case 'RequestCS':
          if (activity.action.sourceIp !== ip) {
            backgroundItem = styles.relayedItem;
          } else {
            backgroundItem = styles.requestedItem;
          }
          break;
        default:
          backgroundItem = styles.acquiredItem;
          break;
      }

      return (
        <div key={`${index}${ip}`} className={`${backgroundItem} ${highlighted} ${styles.activityItem}`}>
          <div className="ml-2 is-size-7">
            <label className="has-background-info-light px-1 ">Time stamp<br /></label>
            {`${format(parseISO(activity.timestamp), 'P hh:mm:ss:SSS ')}`}
          </div>
          <div className="ml-2 mt-2 is-size-7">
            <label className="has-background-info-light px-1">Parent<br /></label>
            {activity.parentIp}
          </div>
          <div className="ml-2 mt-2 is-size-7">
            <label className="has-background-info-light px-1">Source IP<br /></label>
            {activity.action.sourceIp}
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