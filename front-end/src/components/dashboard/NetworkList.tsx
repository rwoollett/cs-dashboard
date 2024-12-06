import React, { useState } from "react";
import { Client } from "../../graphql/generated/graphql-cstoken";
import { GrSearch, GrBook } from "react-icons/gr";
import ClientNode from "./ClientNode";
import axios from 'axios';

/**
 * Network list.
 * Show all network node clients in the range of ports network
 * 
 */
type NetworkListProps = {
  clientList: Client[];
  range: {
    from: number;
    to: number;
  }
}

const NetworkList: React.FC<NetworkListProps> = ({ clientList, range }) => {

  const clientsList = clientList.map((client) => {
    return (
      <div key={`${client.id}`} className="panel-block">
        <span className="panel-icon">
          <GrBook />
        </span>
        <ClientNode client={client} />
      </div>
    );
  });

  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doPostStartRequest = async (props = {}) => {
    const body = {};
    try {
      setErrors(null);
      const response = await axios.post('/api/client/start', { ...body, ...props });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err);
        // } else {
        //   handleUnexpectedError(err);
      }
    }
  };

  const doPostStopRequest = async (props = {}) => {
    const body = {};
    try {
      setErrors(null);
      const response = await axios.post('/api/client/stop', { ...body, ...props });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err);
      }
    }
  };

  return (
    <div className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <div className="columns is-multiline my-0">
          <p className="is-size-7 my-0 p-0 column is-full">Range of IP for network group is:</p>
          <p className="is-size-7 my-0 p-0 column  is-one-third"><span className="has-text-weight-light">From: </span>{range.from}</p>
          <p className="is-size-7 my-0 p-0 column is-one-third"><span className="has-text-weight-light">To: </span>{range.to}</p>
        </div>
      </div>
      <div className="panel-block">
        <div>
          <p className="is-size-6 my-0">
            {errors}
            <div className="fixed-grid has-2-cols">
              <div className="grid buttons are-small">
                <div className="cell">
                  <button onClick={() => doPostStartRequest()} className="button  is-info is-light">
                    Start Group
                  </button>
                </div>
                <div className="cell">
                  <button onClick={() => doPostStopRequest()} className="button  is-info is-light">
                    Stop Group
                  </button>
                </div>
              </div>
            </div>
          </p>
        </div>
      </div>
      <label className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </label>

      {clientsList}
    </div>
  );

};

export default NetworkList;