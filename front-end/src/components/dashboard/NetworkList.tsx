import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faBook, faVectorSquare } from '@fortawesome/free-solid-svg-icons'

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const NetworkList: React.FC = () => {

  return (
    <nav className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <FontAwesomeIcon icon={faSearch} />
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
      <p className="panel-tabs">
        <a href="/" className="is-active">All</a>
        <a href="/" >Public</a>
      </p>
      <a href="/" className="panel-block is-active">
        <span className="panel-icon">
          <FontAwesomeIcon icon={faBook} />
        </span>
        bulma
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <FontAwesomeIcon icon={faVectorSquare} />
        </span>
        marksheet
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <FontAwesomeIcon icon={faVectorSquare} />
        </span>
        bulma
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <FontAwesomeIcon icon={faBook} />
        </span>
        marksheet
      </a>
    </nav>
  );

};

export default NetworkList;