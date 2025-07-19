import React, { useEffect, useState } from "react";
import { useRequestedCsTokenSubscription, RequestCs } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';


/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const RequestToken: React.FC = () => {
  const { loading, data, error: onFeedError } = useRequestedCsTokenSubscription();
  const [requestedCS, setRequestCS] = useState<RequestCs[]>([]);

  useEffect(() => {
    if (loading) { }
    else if (onFeedError) {
      console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);
    } else {
      if (data && data.requestCS_Created) {
        setRequestCS(state => ([data.requestCS_Created as RequestCs, ...state.slice(0,9)]));
      }
    }
  }, [loading, onFeedError, data]);

  const requestList = requestedCS.map((requestCS, index) => {

    const relayedInfo = requestCS.relayed && (<>
      <div className="cell">
        <label className="has-background-warning-light px-1">Originator<br /></label>
        {requestCS.originalIp}
      </div>
    </>);

    const ifHasRelay = requestCS.relayed ? "has-text-warning" : "";
    //console.log('requestedCS: ',index);

    return (
      <div key={`${index}`} className="panel-block">
      {/* <div key={`${requestCS.sourceIp}_${requestCS.requestedAt}`} className="panel-block"> */}
      <div className="fixed-grid has-2-cols">
          <div className="grid">
            <div className="cell mr-6">
              <label className="has-background-info-light px-1">Client&nbsp;IP<br /></label>
              <span className={`${ifHasRelay}`}>{requestCS.sourceIp}</span>
            </div>
            <div className="cell mr-6">
              <label className="has-background-info-light px-1">Time stamp<br /></label>
              {`${format(parseISO(requestCS.requestedAt), 'P hh:mm:ss:SSS ')}`}
            </div>
            <div className="cell mr-6 is-row-start-2">
              <label className="has-background-info-light px-1">Parent<br /></label>
              {requestCS.parentIp}
            </div>
            {relayedInfo}
          </div>
        </div>
      </div>);
  }
  );

  return (
    <div className="panel">
      <p className="panel-heading">Request Token Activity</p>
      <div>
        {requestList}
      </div>
    </div>
  );

};

export default RequestToken;