import React, { useEffect, useState } from "react";
import { useAcquiredCsTokenSubscription, AcquireCs } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';


/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const AcquireToken: React.FC = () => {
  const { loading, data, error: onFeedError } = useAcquiredCsTokenSubscription(
    {
      context: { service: 'cstoken'}
    }
  );
  const [acquiredCS, setAcquiredCS] = useState<AcquireCs[]>([]);

  useEffect(() => {
    if (loading) { }
    else if (onFeedError) {
      console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);
    } else {
      if (data && data.acquireCS_Created) {
        setAcquiredCS(state => ([data.acquireCS_Created as AcquireCs, ...state.slice(0, 4)]));
      }
    }
  }, [loading, onFeedError, data]);

  const requestList = acquiredCS.map(requestCS => (
    <div key={`${requestCS.sourceIp}_${requestCS.acquiredAt}`}
      className="panel-block">
      <div className="columns is-multiline">
        <div className="column is-6 mx-0">
          <label className={`has-background-info-light px-1`}>Client&nbsp;IP<br /></label>
          {requestCS.ip}
        </div>
        <div className="column is-6">
          <label className="has-background-info-light px-1">Time stamp<br /></label>
          {`${format(parseISO(requestCS.acquiredAt), 'P hh:mm:ss:SSS ')}`}
        </div>
        <div className="column is-12">
          <label className="has-background-info-light px-1">Parent<br /></label>
          <div className="cell">{requestCS.sourceIp}</div>
        </div>
      </div>
    </div>)
  );

  return (
    <div className="panel">
      <p className="panel-heading">Acquire Token Activity</p>

      {requestList}
    </div>
  );

};

export default AcquireToken;