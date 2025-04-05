import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard/Dashboard";
//import CanvasGOL from "./CanvasGOL";
import CanvasTTT from "./CanvasTTT";
import useUsersContext from "../hooks/use-users-context";

/**
 * MainPanel is wrapper around the Dashboard items.
 * 
 */
const MainPanel: React.FC = () => {
  const { isAuthenticated, user, signIn } = useUsersContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("#");

  useEffect(() => {
    (async () => {
      const { userId, email, isLoggedIn: asIsLogged } = await isAuthenticated();
      setIsLoggedIn(asIsLogged);
      setUserId(userId as string);
    })();
  }, [isLoggedIn, isAuthenticated]);

  return (
    <section className="mt-2 panel is-primary">
      <div className="container is-widescreen">
        <div className="px-4 pb-6">
          <CanvasTTT />
        </div>
        <div className="px-4 pb-6">
          <Dashboard isAuthenticated={false} />
        </div>
        {/* <div className="px-4 pb-6">
          <CanvasGOL />
        </div> */}
        <p>teee</p>
        {isLoggedIn && "yes loggined"} <br />
        {user && JSON.stringify(user)}

      </div>
    </section>);

};

export default MainPanel;