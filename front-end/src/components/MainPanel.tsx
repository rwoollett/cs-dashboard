import React from "react";
import Dashboard from "./dashboard/Dashboard";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const MainPanel: React.FC = () => {

  return (
    <section className="mt-2 panel is-primary">
      <div className="container is-widescreen">
        <div className="px-4 pb-6">
          <Dashboard />

        </div>
      </div>
    </section>);

};

export default MainPanel;