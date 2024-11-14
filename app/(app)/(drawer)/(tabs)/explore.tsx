import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
} from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePickerButton from "@/app/components/ImagePickerButton";
import {useMessages} from "@/hooks/useMessages";
import { useSession } from "@/context";
import { getMessages } from "@/lib/appwrite-service";
import MessageBubble from "@/app/components/MessageBubble";

/**
 * TabTwoScreen component
 * This component renders the main screen with messages and a footer for sending new messages.
 *
 * @component
 * @example
 * return (
 *   <TabTwoScreen />
 * )
 */
export default function TabTwoScreen() {
  const { messages, isConnected, createMessage } = useMessages();
  const { user } = useSession();
  const [displayMsg, setDisplayMsg] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /**
   * Fetch messages on component mount and when messages change
   */
  useEffect(() => {
    getMessages().then((response) => {
      setDisplayMsg(response?.documents);
    });
  }, [messages]);

  /**
   * Handle sending a new message
   * @function
   */
  const handleSendMessage = () => {
    console.log("New message:", newMessage);
    createMessage(newMessage, selectedImage!);
    setNewMessage("");
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-gray-100">
        {/* Display reconnecting message if not connected */}
        {!isConnected && (
          <Text className="text-red-500 text-center mt-2">Reconnecting...</Text>
        )}

        {/* Display messages */}
        <FlatList
          data={displayMsg}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isCurrentUser={item.owner_id === user?.$id} // Check if the message is from the current user
            />
          )}
          keyExtractor={(item) => item.$id}
        />

        {/* Display selected image */}
        {selectedImage && (
          <View className="flex-row m-2 justify-end">
            <View className="p-2 rounded-lg max-w-xs bg-blue-500">
              <Image
                source={{ uri: selectedImage }}
                className="w-24 h-24 rounded-lg mt-2"
                style={{ resizeMode: "contain" }}
              />
            </View>
          </View>
        )}

        <View className="absolute bottom-0 left-0 right-0 p-4 pr-1 bg-white flex-row border-t border-gray-300">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-2 w-[80%]"
            placeholder="Enter your message"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <View className="flex-row items-center w-[20%]">
            <TouchableOpacity
              onPress={handleSendMessage}
              className="mr-1 ml-2 items-center"
            >
              <Icon name="paper-plane-outline" size={24} color={"gray"} />
            </TouchableOpacity>
            <ActionSheetProvider>
              <ImagePickerButton onImagePicked={setSelectedImage} />
            </ActionSheetProvider>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
