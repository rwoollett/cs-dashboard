import React, { useEffect, useState } from "react";
import { useRequestCsTokenSubscription, RequestCs } from "../../graphql/generated/graphql-cstoken";
import { GrUnlink } from "react-icons/gr";
import { parseISO, format } from 'date-fns';


/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const AcquireToken: React.FC = () => {
  const { loading, data, error: onFeedError } = useRequestCsTokenSubscription();
  const [requestedCS, setRequestCS] = useState<RequestCs[]>([]);

  useEffect(() => {
    if (loading) { }
    else if (onFeedError) {
      console.log(`OnFeedError: ${JSON.stringify(onFeedError)}`);
    } else {
      if (data && data.requestCS) {
        const { sourceIp, requestedAt, relayed } = data.requestCS;
        setRequestCS(state => ([data.requestCS as RequestCs, ...state.slice(0, 4)]));
        console.log(sourceIp, requestedAt, relayed);
      }
    }
  }, [loading, onFeedError, data]);

  const requestList = requestedCS.map(requestCS => (
    <a key={`${requestCS.id}`} href={`${requestCS.id}`} className="panel-block">
      <span className="panel-icon">
        <GrUnlink />
      </span>
      <div className="columns is-1-mobile is-0-tablet is-2-desktop is-8-widescreen is-2-fullhd">
        <div className="column is-3">
          {requestCS.sourceIp}
        </div>
        <div className="column is-9">
          {`${format(parseISO(requestCS.requestedAt), 'P hh:mm:ss:SSS ')}`}
        </div>
        {/* <div className="column is-1">
          <div className="fixed-grid has-2-cols">
            <div className="grid">
              <div className="cell is-hidden-tablet"><label>Relayed</label></div>
              <div className="cell">{requestCS.relayed}</div>
            </div>
          </div>
        </div> */}
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