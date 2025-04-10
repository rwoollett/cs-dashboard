import axios from "axios";
import { createContext, useState } from "react";
import { SignInUser, User } from "./User";

export interface Shared {
  user: User | null;
  getToken: () => Promise<string | null>;
  signIn: (user: SignInUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultShared: Shared = {
  user: null,
  getToken: async () => null,
  signIn: async (_: SignInUser) => { },
  signOut: async () => { },
};

const UsersContext = createContext<Shared>(defaultShared);

function UsersProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null);
  //const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const authServiceUrl = `${process.env.REACT_APP_AUTH_SERVER_URL}`;

  const signIn = async ({ email, password }: SignInUser) => {
    try {
      const response = await axios.post<User>(`${authServiceUrl}/api/users/signin`,
        { email, password },
        { withCredentials: true }
      );
      console.log('signin res', response);
      setUser({
        ...response.data,
        name: response.data.email
      });
      //setIsSignedIn(true);
    } catch (error: any) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        //console.error("Error Response:", error.response.data);
        //console.error("Status Code:", error.response.status);
        //console.error("Headers:", error.response.headers);
        throw error.response; // Return the error response data
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No Response:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message);
      }
      throw error; // Re-throw the error if needed
    }
  };

  const getToken = async () => {
    try {
      const currentToken = await axios.get(`${authServiceUrl}/api/users/currenttoken`,
        { withCredentials: true }
      );
      console.log ('user', user, 'token', currentToken.data.currentToken);
      if (!user && currentToken.data.currentToken != null) {
        const currentUser = await axios.get(`${authServiceUrl}/api/users/currentuser`,
          { withCredentials: true }
        );
        console.log('gttoken',currentUser.data.currentUser);
        setUser({
          ...currentUser.data.currentUser,
          name: currentUser.data.currentUser.email
        });
        //setIsSignedIn(true);
      }
      return currentToken.data.currentToken;
    } catch (error: any) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        //console.error("Error Response:", error.response.data);
        //console.error("Status Code:", error.response.status);
        //console.error("Headers:", error.response.headers);
        throw error.response; // Return the error response data
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No Response:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message);
      }
      throw error; // Re-throw the error if needed
    }
  };

  const signOut = async () => {
    await axios.post(`${authServiceUrl}/api/users/signout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    //setIsSignedIn(false);
  };

  const valueToShare: Shared = {
    user,
    getToken,
    signIn,
    signOut,
  };

  return (<UsersContext.Provider value={valueToShare}>
    {children}
  </UsersContext.Provider>);

};

export { UsersProvider };
export default UsersContext;