import axios from "axios";
import React, { createContext, useCallback, useState } from "react";
import { CurrentUser, SignInUser, User } from "./User";
//import { Color, NotifyItem, NotifiyLink } from "../components/notify/Notification";
//import { v4 } from 'uuid';
//import { NotificationList } from "../components/notify";
//import { ROUTES } from "../constants/routes";

type HasAuthentication = {
  isLoggedIn: boolean;
  userId: string | undefined;
  email: string | undefined;
}

export interface Shared {
  user: User | undefined;
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: () => Promise<HasAuthentication>;
  signIn: (user: SignInUser) => Promise<void>;
  signOut: () => Promise<void>;
  //  notifications: NotifyItem[];
  //  createNotification: (color: string, autoClose: boolean, message: string) => void;
//  info: (message: string,  autoClose: boolean, link?: NotifiyLink) => void;
//  success: (message: string, autoClose: boolean) => void;
//  warning: (message: string, autoClose: boolean) => void;
//  error: (message: string, autoClose: boolean) => void;
 // handleShowNotificationsClick: (isShown: boolean) => void;
};

const defaultShared: Shared = {
  user: undefined,
  token: null,
  setToken: (_:string | null) => { },
  isAuthenticated: async () => Promise.resolve({
    isLoggedIn: false,
    userId: undefined,
    email: undefined
  }),
  signIn: async (_: SignInUser) => { },
  signOut: async () => { },
  //  notifications: [],
//  createNotification: (color: string, autoClose: boolean, message: string) => { },
//  info: (message: string,  autoClose: boolean, link?: NotifiyLink) => { },
 // success: (message: string, autoClose: boolean) => { },
//  warning: (message: string, autoClose: boolean) => { },
//  error: (message: string, autoClose: boolean) => { },
//  handleShowNotificationsClick: (isShown: boolean) => { }
};

const UsersContext = createContext<Shared>(defaultShared);

function UsersProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | null>(null);
//  const [notifications, setNotifications] = useState<NotifyItem[]>([]);
//  const [showNotifications, setShowNotifications] = useState(true);

  const isAuthenticated = useCallback(async () => {
    const { data } = await axios.get<CurrentUser>('/api/users/currentuser');
    const isLoggedIn = data?.currentUser ? true : false
    if (isLoggedIn) {
      setUser({
        email: data?.currentUser?.email as string,
        id: data?.currentUser?.id as string,
        name: data?.currentUser?.email as string,
        password: ""
      })
    } else {
      setUser(undefined);
    }
    return {
      isLoggedIn: data?.currentUser ? true : false,
      userId: data?.currentUser?.id,
      email: data?.currentUser?.email
    };

  }, []);

  const signIn = async ({ email, password }: SignInUser) => {
    const response = await axios.post<User>('/api/users/signin', {
      email, password
    });
    setUser({
      ...response.data,
      name: response.data.email
    });
  };

  const signOut = async () => {
    await axios.post('/api/users/signout');
    setUser(undefined);
  };

//  const handleShowNotificationsClick = (isShown: boolean) => {
//    setShowNotifications(isShown);
//  };

  // const createNotification = useCallback((
  //   color: string,
  //   autoClose = false,
  //   message: string,
  //   link?: NotifiyLink
  // ) => {
  //   setNotifications((prevNotifications) => {
  //     return [
  //       ...prevNotifications, {
  //         color,
  //         autoClose,
  //         message,
  //         link,
  //         id: v4()//;prevNotifications.length
  //       }];
  //   });
  // }, []);

  // const deleteNotification = (id: string) => {
  //   const filteredNotifications = notifications.filter(
  //     (notification) => notification.id !== id,
  //     []
  //   );
  //   setNotifications(filteredNotifications);
  // };

  // const info = useCallback((
  //   message: string,
  //   autoClose: boolean,
  //   link?: NotifiyLink,) => {
  //   createNotification(
  //     Color.info,
  //     autoClose,
  //     message,
  //     link
  //   );
  // }, [createNotification]);

  // const success = useCallback((message: string, autoClose: boolean) => {
  //   createNotification(
  //     Color.success,
  //     autoClose,
  //     message,
  //   );
  // }, [createNotification]);

  // const warning = useCallback((message: string, autoClose: boolean) => {
  //   createNotification(
  //     Color.warning,
  //     autoClose,
  //     message,
  //   );
  // }, [createNotification]);

  // const error = useCallback((message: string, autoClose: boolean) => {
  //   createNotification(
  //     Color.error,
  //     autoClose,
  //     message,
  //   );
  // }, [createNotification]);

  const valueToShare: Shared = {
    user,
    token,
    setToken,
//    notifications,
    isAuthenticated,
    signIn,
    signOut,
//    createNotification,
//    info, success, warning, error,
 //   handleShowNotificationsClick
  };

  return (<UsersContext.Provider value={valueToShare}>
    {/* {showNotifications && <NotificationList notifications={notifications} onDelete={deleteNotification} />} */}
    {children}
  </UsersContext.Provider>);

};

export { UsersProvider };
export default UsersContext;