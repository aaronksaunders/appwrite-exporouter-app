import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";

/**
 * TabsIndexScreen displays the main home screen content with personalized welcome message
 * @returns {JSX.Element} Home screen component
 */
const TabsIndexScreen = () => {
  // ============================================================================
  // Hooks
  // ============================================================================
  const { signOut, user } = useSession();

  // ============================================================================
  // Handlers
  // ============================================================================
  
  /**
   * Handles the logout process
   */
  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  // ============================================================================
  // Computed Values
  // ============================================================================
  
  /**
   * Gets the display name for the welcome message
   * Prioritizes user's name, falls back to email, then default greeting
   */
  const displayName = user?.name || user?.email?.split('@')[0] || 'Guest';

  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <View className="flex-1 justify-center items-center p-4">
      {/* Welcome Section */}
      <View className="items-center mb-8">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Welcome back,
        </Text>
        <Text className="text-2xl font-bold text-blue-600">
          {displayName}
        </Text>
        <Text className="text-sm text-gray-500 mt-2">
          {user?.email}
        </Text>
      </View>
      
      {/* Logout Button */}
      <Pressable
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-lg active:bg-red-600"
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </Pressable>
    </View>
  );
};

export default TabsIndexScreen;
