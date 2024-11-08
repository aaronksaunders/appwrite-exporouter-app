import React, { useEffect, useState } from "react";

import { Models } from "react-native-appwrite";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "@/lib/appwrite-service";

const AuthContext = React.createContext<{
  signIn: (
    email: string,
    password: string
  ) => Promise<Models.User<Models.Preferences> | undefined> | undefined;
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<Models.User<Models.Preferences> | undefined> | undefined;
  signOut: () => void;
  session?: Models.Session | undefined;
  isLoading: boolean;
  user?: Models.User<Models.Preferences> | undefined;
}>({
  signIn: () => undefined,
  signUp: () => undefined,
  signOut: () => null,
  session: undefined,
  isLoading: false,
  user: undefined,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [session, setSession] = useState<Models.Session | undefined>(undefined);
  const [user, setUser] = useState<Models.User<Models.Preferences> | undefined>(
    undefined
  );

  useEffect(() => {
    /**
     * Initialize the component
     */
    async function init() {
      try {
        const response = await getCurrentUser();
        setUser(response?.user);
        setSession(response?.session!);
        setIsLoading(false);
      } catch (e) {
        console.log("[error getting user] ==>", e);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          // Perform sign-in logic here
          const response = await login(email, password);
          setSession(response?.session!);
          setUser(response?.user!);
          setIsLoading(false);
          return response?.user;
        },
        signUp: async (email: string, password: string, name?: string) => {
          // Perform sign-up logic here
          const response = await register(email, password, name);
          setSession(response?.session!);
          setUser(response?.user!);
          setIsLoading(false);
          return response?.user;
        },
        signOut: async () => {
          // Perform sign-out logic here
          await logout();
          setSession(undefined);
          setUser(undefined);
          setIsLoading(false);
        },
        session,
        isLoading,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
