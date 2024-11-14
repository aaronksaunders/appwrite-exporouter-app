import { useState, useEffect, useCallback } from "react";
import {
  createDocument,
  getCurrentUser,
  subscribeToMessages,
  uploadImage,
  uploadImageREST,
  urlToBlob,
} from "../lib/appwrite-service";

export const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const createMessage = async (message: string, imageUrl: string) => {
    try {
      let imageId = null;
      if (imageUrl) {
        const blob = await urlToBlob(imageUrl);
        if (!blob) {
          throw new Error("Failed to convert URL to blob");
        }

        // create a unique file name, include the user ID if needed
        const userId = (await getCurrentUser())?.user.$id;
        if (!userId) {
          throw new Error("User not authenticated");
        }

        const fileName = `${userId}-${new Date().getTime()}.jpg`;
        const file = await uploadImage(blob, fileName);

        if (!file.$id) {
          throw new Error("Failed to upload image");
        }

        imageId = file.$id; // Use the file ID or URL as needed
      }
      const resp = await createDocument(message, imageId!);
      if (resp) {
        console.log("Message created successfully", resp);
      }
      return resp;
    } catch (error) {
      console.error("error creating message", error);
    }
  };

  const setupSubscription = useCallback(() => {
    try {
      const unsubscribe = subscribeToMessages((response) => {
        console.log("received message", response);
        setMessages((prev) => [...prev, response]);
        setIsConnected(true);
      });

      return unsubscribe;
    } catch (error) {
      console.error("error subscribing to messages", error);
      setIsConnected(false);
      // Attempt to reconnect after 1 second
      setTimeout(setupSubscription, 1000);
      return () => {};
    }
  }, []);

  useEffect(() => {
    const unsubscribe = setupSubscription();
    console.log("subscribed to messages", unsubscribe);
    return () => {
      unsubscribe();
    };
  }, [setupSubscription]);

  return { messages, isConnected, createMessage };
};
