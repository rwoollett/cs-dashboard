import React from "react";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const AcquireToken: React.FC = () => {

  return (
    <nav className="panel">
      <p className="panel-heading">Acquire Token Activity</p>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <i className="fas fa-book" aria-hidden="true"></i>
        </span>
        marksheet
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <i className="fas fa-book" aria-hidden="true"></i>
        </span>
        bulma
      </a>
      <a href="/" className="panel-block">
        <span className="panel-icon">
          <i className="fas fa-book" aria-hidden="true"></i>
        </span>
        banana
      </a>
    </nav>
  );

};

export default AcquireToken;