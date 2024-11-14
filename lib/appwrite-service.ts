import { Permission, Role, Storage } from "react-native-appwrite";
import { Client, Account, ID, Models, Databases } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

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
  // .setEndpointRealtime(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT_REALTIME!)
  .setPlatform("com.ci.appwrite1expo");

/**
 * Initialize Appwrite services
 */
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

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
        // console.log("[user retrieved successfully] ==>", { user, session });
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

// ============================================================================
// Database Services
// ============================================================================

// subscribe to messages collection
export const subscribeToMessages = (callback: (response: any) => void) => {
  const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
  const COLLECTION_ID_MESSAGES =
    process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!;

  // subscribe to messages collection to get updates in real-time
  try {
    const unsub = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        console.log("[subcribe message] ==>", response.payload);

        // update the messages state
        callback(response.payload);
      }
    );

    return unsub;
  } catch (e) {
    console.error("[error subscribing to messages] ==>", e);
    return () => {};
  }
};

/**
 * Fetches messages from the database
 * @returns {Promise<Models.DocumentList>}
 */
export async function getMessages() {
  const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
  const COLLECTION_ID_MESSAGES =
    process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!;

  console.log("[DATABASE_ID] ==>", DATABASE_ID);
  console.log("[COLLECTION_ID_MESSAGES] ==>", COLLECTION_ID_MESSAGES);

  try {
    // get all messages before subscribing
    return database
      .listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES)
      .then((response) => {
        console.log("[messages] ==>", response);
        return response;
      });
  } catch (e) {
    console.error("[error fetching messages] ==>", e);
  }
}

/**
 * creates a new message document in the database
 * 
 * @param {string} message - The message text
 * @param {string} imageId - The image uri
 * @returns {Promise<Models.Document>}
 * @throws {Error} - Throws an error if the document creation fails
 * 
 * @example
 * createDocument("Hello, World!", "imageId")
 *  .then((response) => console.log("Document created successfully", response))
 * .catch((error) => console.error("Failed to create document", error));
 * 
 */
export const createDocument = async (message: string, imageId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const { user } = currentUser;
    const response = await database.createDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!,
      ID.unique(),
      {
        body: message,
        created_at: new Date().toISOString(),
        owner_id: (await account.get()).$id,
        imageId,
      },
      [
        Permission.read(Role.users()), // Anyone can view this document
        Permission.update(Role.user(user?.$id)), // user can update this document
        Permission.delete(Role.user(user?.$id)), // user can delete this document
      ]
    );
    console.log("Document created successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to create document", error);
    throw error;
  }
};

// ============================================================================
// Storage Services
// ============================================================================

/**
 * Converts a URL to a Blob
 * 
 * @param {string} url - The URL to convert to a Blob
 * @returns {Promise<Blob>} - The Blob representation of the URL
 * @throws {Error} - Throws an error if the conversion fails
 */
export const urlToBlob = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting URL to blob:", error);
    throw error;
  }
};
/**
 * Uploads an image Blob to the server
 * 
 * @param {Blob} blob - The image Blob to upload
 * @param {string} fileName - The name of the file
 * @returns {Promise<any>} - The uploaded file information
 * @throws {Error} - Throws an error if the upload fails
 */
export const uploadImage = async (blob: Blob, fileName: string) => {
  console.log("Uploading image:", blob, fileName);
  try {
    const blobData = {
      name: fileName,
      type: blob.type,
      size: blob.size,
      uri: URL.createObjectURL(blob),
    };
    console.log("Blob data:", blobData);
    const file = await storage.createFile(
      "TEST-BUCKET-1",
      ID.unique(),
      blobData
    );
    console.log("File uploaded successfully:", file);
    return file;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Uploads an image Blob to the server using REST API
 * 
 * @param {Blob} blob - The image Blob to upload
 * @param {string} fileName - The name of the file
 * @returns {Promise<any>} - The uploaded file information
 * @throws {Error} - Throws an error if the upload fails
 */
export const uploadImageREST = async (blob: Blob, fileName: string) => {
  console.log("Uploading image:", blob, fileName);
  try {
    const uri = URL.createObjectURL(blob);
    const formData = new FormData();
    formData.append("fileId", ID.unique());
    formData.append("file", {
      uri: uri,
      name: fileName,
      type: blob.type,
    } as any);

    console.log(client.config);

    const response = await fetch(
      `${client.config.endpoint}/storage/buckets/TEST-BUCKET-1/files`,
      {
        method: "POST",
        headers: {
          "X-Appwrite-Project": client.config.project,
          "X-Appwrite-Key": process.env.EXPO_PUBLIC_APPWRITE_API_KEY || "",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error("Failed to upload image:", response);
      throw new Error("Failed to upload image");
    }

    const file = await response.json();
    return file;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Get the view URL of a file
 * 
 * @param {string} fileId - The ID of the file
 * @returns {Promise<string>} - The URL to view the file
 * @throws {Error} - Throws an error if fetching the file view fails
 */
export const getFileView = async (fileId: string): Promise<string> => {
  try {
    const result = await storage.getFileView('TEST-BUCKET-1', fileId);
    return result.href;
  } catch (error) {
    console.error('Error fetching file view:', error);
    throw error;
  }
};