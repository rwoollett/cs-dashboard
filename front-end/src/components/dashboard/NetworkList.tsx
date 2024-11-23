import React from "react";
import { useGetClientsQuery } from "../../graphql/generated/graphql-cstoken";
import { GrSearch, GrBook, GrLink } from "react-icons/gr";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const NetworkList: React.FC = () => {
  const { data, loading } = useGetClientsQuery({
    variables: { range: { from: 5010, to: 5040 } }
  });

  console.log(loading, data);

  return (
    <nav className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </div>
      <p className="panel-tabs">
        <a href="/" className="is-active">All</a>
        <a href="/" >Public</a>
      </p>
      <a href="/" className="panel-block is-active">
        <span className="panel-icon">
          <i className="fas fa-home"></i>
          <GrBook />
        </span>
        bulma
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <GrLink />
        </span>
        marksheet
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          {/* <FaVectorSquare /> */}
        </span>
        bulma
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          {/* <FaVectorSquare /> */}
        </span>
        marksheet
      </a>
    </nav>
  );

};

export default NetworkList;