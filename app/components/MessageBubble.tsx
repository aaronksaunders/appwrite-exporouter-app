import { format, isToday } from "date-fns";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Models } from "react-native-appwrite";
import MessageContent from "./MessageContent";
import { getFileView } from "@/lib/appwrite-service";

interface MessageBubbleProps {
  message: Models.Document;
  isCurrentUser: boolean;
}

/**
 * MessageBubble component
 * This component renders a message bubble with the message content and timestamp.
 *
 * @component
 * @example
 * return (
 *   <MessageBubble message={message} isCurrentUser={true} />
 * )
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /**
   * Fetch the image URL if the message contains an image
   */
  useEffect(() => {
    if (message.imageId) {
      getFileView(message.imageId).then(setImageUrl).catch(console.error);
    }
  }, [message.imageId]);

  const messageDate = new Date(message.created_at);
  const formattedDate = isToday(messageDate)
    ? format(messageDate, "p") // Format time without seconds if today
    : format(messageDate, "PP p"); // Format full date and time otherwise

  return (
    <View
      key={message.$id}
      className={`flex-row m-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`p-2 rounded-lg max-w-xs ${
          isCurrentUser ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <MessageContent
          message={{ ...message, imageUrl }}
          isCurrentUser={isCurrentUser}
        />
        <Text
          className={`text-[8px] ${
            isCurrentUser ? "text-gray-100" : "text-gray-600"
          } mt-1`}
        >
          {formattedDate}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
