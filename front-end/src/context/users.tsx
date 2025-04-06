import axios from "axios";
import { createContext, useState } from "react";
import { SignInUser, User } from "./User";

export interface Shared {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  signIn: (user: SignInUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultShared: Shared = {
  user: null,
  token: null,
  setToken: (_: string | null) => { },
  signIn: async (_: SignInUser) => { },
  signOut: async () => { },
};

const UsersContext = createContext<Shared>(defaultShared);

function UsersProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
  };

  const valueToShare: Shared = {
    user,
    token,
    setToken,
    signIn,
    signOut,
  };

  return (<UsersContext.Provider value={valueToShare}>
    {children}
  </UsersContext.Provider>);

};

export { UsersProvider };
export default UsersContext;