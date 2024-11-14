import React, { useState } from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { Models } from "react-native-appwrite";

interface MessageContentProps {
  message: Models.Document;
  isCurrentUser: boolean;
}
/**
 * MessageContent component
 * This component renders the content of a message, including text and image.
 * 
 * @component
 * @example
 * return (
 *   <MessageContent message={message} isCurrentUser={true} />
 * )
 */
const MessageContent: React.FC<MessageContentProps> = ({
  message,
  isCurrentUser,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {message.body && (
        <Text
          className={`text-xs ${isCurrentUser ? "text-white" : "text-black"}`}
        >
          {message.body}
        </Text>
      )}
      {message.imageUrl && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: message.imageUrl }}
            className="w-24 h-24 rounded-lg mt-1"
            style={{ resizeMode: "contain" }}
          />
        </TouchableOpacity>
      )}
      <Modal visible={modalVisible} transparent={true}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: message.imageUrl }}
            style={{ width: "90%", height: "90%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MessageContent;
