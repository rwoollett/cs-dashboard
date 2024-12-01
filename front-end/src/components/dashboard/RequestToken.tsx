import React, { useEffect, useState } from "react";
import { useRequestedCsTokenSubscription, RequestCs } from "../../graphql/generated/graphql-cstoken";
import { GrUnlink } from "react-icons/gr";
import { parseISO, format } from 'date-fns';


/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const AcquireToken: React.FC = () => {
  const { loading, data, error: onFeedError } = useRequestedCsTokenSubscription();
  const [requestedCS, setRequestCS] = useState<RequestCs[]>([]);

  useEffect(() => {
    if (loading) { }
    else if (onFeedError) {
      console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);
    } else {
      if (data && data.requestCS_Created) {
        setRequestCS(state => ([data.requestCS_Created as RequestCs, ...state.slice(0, 4)]));
      }
    }
  }, [loading, onFeedError, data]);

  const requestList = requestedCS.map(requestCS => (
    <a key={`${requestCS.sourceIp}_${requestCS.requestedAt}`}
      href={`${requestCS.sourceIp}_${requestCS.requestedAt}`} className="panel-block">
      <span className="panel-icon">
        <GrUnlink />
      </span>
      <div className="columns is-1-mobile is-0-tablet is-2-desktop is-8-widescreen is-2-fullhd">
        <div className="column is-3">
          {requestCS.sourceIp}
        </div>
        <div className="column is-7">
          {`${format(parseISO(requestCS.requestedAt), 'P hh:mm:ss:SSS ')}`}
        </div>
        <div className="column is-2">
          <div className="fixed-grid has-2-cols">
            <div className="grid">
              <div className="cell">{requestCS.parentIp}</div>
              <div className="cell"><label>{requestCS.relayed.toString()}</label></div>
            </div>
          </div>
        </div>
      </div>
    </a>)
  );

  return (
    <div className="panel">
      <p className="panel-heading">Request Token Activity</p>

      {requestList}
    </div>
  );

};

export default AcquireToken;