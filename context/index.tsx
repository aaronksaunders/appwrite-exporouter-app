import React, { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "@/lib/appwrite-service";

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Authentication context interface defining available methods and state
 * for managing user authentication throughout the application.
 * @interface
 */
interface AuthContextType {
  /**
   * Authenticates an existing user with their credentials
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Models.User<Models.Preferences> | undefined>} Authenticated user or undefined
   */
  signIn: (
    email: string,
    password: string
  ) => Promise<Models.User<Models.Preferences> | undefined> | undefined;

  /**
   * Creates and authenticates a new user account
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} [name] - Optional user's display name
   * @returns {Promise<Models.User<Models.Preferences> | undefined>} Created user or undefined
   */
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<Models.User<Models.Preferences> | undefined> | undefined;

  /**
   * Logs out the current user and clears session
   * @returns {void}
   */
  signOut: () => void;

  /** Current active session */
  session?: Models.Session;
  /** Loading state for authentication operations */
  isLoading: boolean;
  /** Currently authenticated user */
  user?: Models.User<Models.Preferences>;
}

// ============================================================================
// Context Creation
// ============================================================================

/**
 * Default context values when used outside provider
 * @type {AuthContextType}
 */
const defaultContext: AuthContextType = {
  signIn: () => undefined,
  signUp: () => undefined,
  signOut: () => null,
  session: undefined,
  isLoading: false,
  user: undefined,
};

const AuthContext = React.createContext<AuthContextType>(defaultContext);

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook to access the authentication context
 * @throws {Error} When used outside of SessionProvider (development only)
 * @returns {AuthContextType} The authentication context value
 */
export function useSession() {
  const value = React.useContext(AuthContext);
  
  if (process.env.NODE_ENV !== "production" && !value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  
  return value;
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Provider component that manages authentication state and operations
 * @param {React.PropsWithChildren} props - Component props including children
 * @returns {JSX.Element} Provider component wrapping children
 */
export function SessionProvider(props: React.PropsWithChildren) {
  // State
  const [isLoading, setIsLoading] = React.useState(true);
  const [session, setSession] = useState<Models.Session>();
  const [user, setUser] = useState<Models.User<Models.Preferences>>();

  /**
   * Updates authentication state with new session data
   * @param {Object} response - The authentication response containing session and user data
   */
  const updateAuthState = (
    response: { session?: Models.Session; user?: Models.User<Models.Preferences> } | undefined
  ) => {
    setSession(response?.session!);
    setUser(response?.user!);
    setIsLoading(false);
  };

  /**
   * Clears all authentication state data
   */
  const clearAuthState = () => {
    setSession(undefined);
    setUser(undefined);
    setIsLoading(false);
  };

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  /**
   * Handles user sign-in process
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Models.User<Models.Preferences> | undefined>} Authenticated user
   */
  const handleSignIn = async (email: string, password: string) => {
    const response = await login(email, password);
    updateAuthState(response);
    return response?.user;
  };

  /**
   * Handles new user registration and automatic sign-in
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} [name] - Optional user's name
   * @returns {Promise<Models.User<Models.Preferences> | undefined>} Created user
   */
  const handleSignUp = async (email: string, password: string, name?: string) => {
    const response = await register(email, password, name);
    updateAuthState(response);
    return response?.user;
  };

  /**
   * Handles user sign-out process
   * @returns {Promise<void>}
   */
  const handleSignOut = async () => {
    await logout();
    clearAuthState();
  };

  // ============================================================================
  // Initialization
  // ============================================================================

  useEffect(() => {
    /**
     * Initializes the authentication state by checking for existing session
     * @async
     * @returns {Promise<void>}
     */
    async function init() {
      try {
        const response = await getCurrentUser();
        if (response) {
          updateAuthState(response);
        } else {
          clearAuthState();
        }
      } catch (e) {
        console.log("[error getting user] ==>", e);
        clearAuthState();
      }
    }
    init();
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        session,
        isLoading,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
