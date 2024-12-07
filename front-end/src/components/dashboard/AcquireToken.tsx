import React, { useEffect, useState } from "react";
import { useAcquiredCsTokenSubscription, AcquireCs } from "../../graphql/generated/graphql-cstoken";
import { parseISO, format } from 'date-fns';


/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const AcquireToken: React.FC = () => {
  const { loading, data, error: onFeedError } = useAcquiredCsTokenSubscription();
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
      <div className="columns is-1-mobile is-8-tablet is-8-desktop is-8-widescreen is-8-fullhd">
        <div className="column is-1">
          {requestCS.ip}
        </div>
        <div className="column is-6">
          {`${format(parseISO(requestCS.acquiredAt), 'P hh:mm:ss:SSS ')}`}
        </div>
        <div className="column is-1">
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