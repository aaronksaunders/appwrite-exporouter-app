import {
  Client,
  Account,
  ID,
  Models,
  Databases,
} from "react-native-appwrite/src";
import { Storage } from "react-native-appwrite/src/services/storage";
import * as FileSystem from "expo-file-system";
// import * as ImagePicker from "expo-image-picker";

// WEB API
// import * as apw from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) // Your project ID
  .setPlatform("com.ci.appwrite1expo"); // Your application ID or bundle ID

const account = new Account(client);
const storage = new Storage(client);
const database = new Databases(client);

//////////////////////////////////////////////////////////////////////////////////
// ACCOUNTS
//////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves the current user from the server.
 * @returns {Promise<Models.User<Models.Preferences> | null | undefined>} A promise
 * that resolves with the user data if successful, or null if no user is found.
 */
export const getCurrentUser = async () => {
  try {
    // console.log("[creating user] ==>", account);
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
 * Logs in a user with the provided email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns {Promise<any>} A Promise that
 * resolves to the user session object.
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
 * Logs out the user by deleting their sessions and setting the logged-in user to undefined.
 *
 * @returns {Promise<null | undefined>} A promise that resolves when the user is logged out.
 */
export async function logout(): Promise<null | undefined> {
  try {
    const u = await account.deleteSessions();
    return null;
  } catch (e) {
    console.error("[error logging out] ==>", e);
  }
}

/**
 * Registers a new user with the provided email, password, and name.
 *
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param name - The name of the user (optional).
 * @returns {Promise<Models.User<Models.Preferences> | undefined>} A promise that resolves
 * to the user session object.
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

//////////////////////////////////////////////////////////////////////////////////
// STORAGE
//////////////////////////////////////////////////////////////////////////////////

// /**
//  * Uploads a file to the storage.
//  * @returns {Promise<Models.File>} A promise that resolves when the file is uploaded successfully.
//  * @param file - The file to upload.
//  */
// export async function uploadFile(
//   file: ImagePicker.ImagePickerAsset
// ): Promise<Models.File> {
//   try {
//     console.log("[file info] ==>", file);

//     let params;
//     if (file.uri.startsWith("file://")) {
//       const url = new URL(file.uri);
//       params = {
//         name: url.pathname.split("/").pop()!,
//         size: file.fileSize!,
//         type: file.mimeType!,
//         uri: url.href,
//       };
//     } else {
//       // Read the file as an ArrayBuffer using fetch
//       const response = await fetch(file.uri);
//       const bytes = new Uint8Array(await response.arrayBuffer());

//       // Create a Blob from ArrayBuffer
//       const blob = new Blob([bytes], { type: file.mimeType! });

//       // Create an object URL from Blob
//       const objectURL = URL.createObjectURL(blob);
//       console.log("[object URL] ==>", objectURL);

//       params = {
//         name: file.uri.split("/").pop()!,
//         size: file.fileSize!,
//         type: file.mimeType!,
//         uri: objectURL,
//       };
//     }

//     const response = await storage.createFile(
//       process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
//       ID.unique(),
//       params
//     );
//     console.log("[file uploaded] ==>", response);
//     return response;
//   } catch (e) {
//     console.error("[error uploading file] ==>", e);
//     throw e;
//   }
// }

// /**
//  * Uploads a file to the storage using the web API. This is necessary because the
//  * react native api from appwrite does not support the web platform.
//  * @returns {Promise<Models.File>} A promise that resolves when the file is uploaded successfully.
//  * @param file - The file to upload.
//  */
// export async function uploadFile_web(file: ImagePicker.ImagePickerAsset) {
//   try {
//     const webAWClient = new apw.Client();

//     webAWClient
//       .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
//       .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

//     const storagew = new apw.Storage(webAWClient);

//     const fetchResponse = await fetch(file.uri);
//     const blob = await fetchResponse.blob();
//     const fileFromBlob = new File([blob], file.fileName!, {
//       type: file.mimeType!,
//     });

//     const response = await storagew.createFile(
//       process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!, // The ID of the bucket where you want to upload the file
//       ID.unique(), // The ID of the file
//       fileFromBlob as File // The file you want to upload
//     );

//     console.log("[file uploaded] ==>", response);
//     return response;
//   } catch (e) {
//     console.error("[error uploading file] ==>", e);
//     throw e;
//   }
// }

// export async function testUploadFile(): Promise<Models.File> {
//   const FILE_NAME = "foo.txt";
//   try {
//     // Create the file
//     const fileUri = FileSystem.documentDirectory + FILE_NAME;
//     await FileSystem.writeAsStringAsync(fileUri, "foo file text contents", {
//       encoding: FileSystem.EncodingType.UTF8,
//     });

//     // Get the URI of the file
//     const fileInfo = await FileSystem.getInfoAsync(fileUri).then((fileInfo) => {
//       console.log("File URI:", fileInfo.uri);
//       return fileInfo;
//     });

//     console.log("[file info] ==>", fileInfo);

//     const response = await storage.createFile(
//       process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
//       FILE_NAME,
//       {
//         name: FILE_NAME,
//         size: (fileInfo as any)?.size,
//         type: "text/plain",
//         uri: fileInfo.uri,
//       }
//     );
//     console.log("[file uploaded] ==>", response);
//     return response;
//   } catch (e) {
//     console.error("[error uploading file] ==>", e);
//     throw e;
//   }
// }

// /**
//  * Retrieves a list of files from the storage.
//  * @returns {Promise<Models.File[]>} A promise that resolves when the list of files is retrieved.
//  */
// export async function listFiles(): Promise<Models.File[]> {
//   try {
//     const files = await storage.listFiles(
//       process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!
//     );
//     console.log("[files] ==>", files);
//     return files.files;
//   } catch (e) {
//     console.error("[error listing files] ==>", e);
//     throw e;
//   }
// }

//////////////////////////////////////////////////////////////////////////////////
// DATABASE
//////////////////////////////////////////////////////////////////////////////////

export type Project = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  description: string;
  tasks: Task[];
};

export type Task = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  description: string;
  [key: string]: any;
};

/**
 * Retrieves a list of documents from the database.
 * @returns {Promise<Models.Document[]>} A promise that resolves when the list of documents is retrieved.
 */
export async function listProjectDocuments(): Promise<Project[]> {
  try {
    const documents = await database.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!
    );
    return documents.documents as Project[];
  } catch (e) {
    console.error("[error listing documents] ==>", e);
    throw e;
  }
}
