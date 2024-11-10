import { Client, Account, ID, Models, Databases } from "react-native-appwrite/src";
import { Storage } from "react-native-appwrite/src/services/storage";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Initialize Appwrite client with environment variables
 * @type {Client}
 */
const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform("com.ci.appwrite1expo");

/**
 * Initialize Appwrite services
 */
const account = new Account(client);
const database = new Databases(client);

// ============================================================================
// Types & Interfaces
// ============================================================================



// ============================================================================
// Authentication Services
// ============================================================================

/**
 * Retrieves the current authenticated user and their session
 * @returns {Promise<{ user: Models.User<Models.Preferences>; session: Models.Session } | null | undefined>}
 */
export const getCurrentUser = async () => {
  try {
    return account.get().then(
      async (user) => {
        const session = await account.getSession("current");
        console.log("[user retrieved successfully] ==>", { user, session });
        return { user, session };
      },
      (error) => {
        console.log("[no user found] ==>", error);
        return null;
      }
    );
  } catch (error) {
    console.error("[error initializing appwrite]==>", error);
  }
};

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{ user: Models.User<Models.Preferences>; session: Models.Session } | undefined>}
 */
export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return { user, session };
  } catch (e) {
    console.error("[error logging in] ==>", e);
  }
}

/**
 * Logs out the current user by deleting all sessions
 * @returns {Promise<null | undefined>}
 */
export async function logout(): Promise<null | undefined> {
  try {
    await account.deleteSessions();
    return null;
  } catch (e) {
    console.error("[error logging out] ==>", e);
  }
}

/**
 * Creates a new user account and logs them in
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} [name] - Optional user's name
 * @returns {Promise<{ user: Models.User<Models.Preferences>; session: Models.Session } | undefined>}
 */
export async function register(
  email: string,
  password: string,
  name: string | undefined
) {
  try {
    await account.create(ID.unique(), email, password, name);
    const response = await login(email, password);
    return { user: response?.user, session: response?.session };
  } catch (e) {
    console.error("[error registering] ==>", e);
    throw e;
  }
}
