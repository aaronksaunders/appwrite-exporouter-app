import { useSession } from "@/context";
import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";

const ProfileScreen = () => {
  // ============================================================================
  // Hooks
  // ============================================================================
  const { user } = useSession();

  // ============================================================================
  // Functions
  // ============================================================================

  /**
   * Formats a given date into a readable date and time string.
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date and time string.
   */
  const formatDateTime = (date: Date) => {
    return format(new Date(date), "MMMM do, yyyy hh:mm a");
  };

  // ============================================================================
  // Computed Values
  // ============================================================================

  /**
   * Gets the display name for the welcome message
   * Prioritizes user's name, falls back to email, then default greeting
   */
  const displayName = user?.name || user?.email?.split("@")[0] || "Guest";

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <View className="flex-1 mt-4 p-4">
      {/* Welcome Section */}
      <View className="mb-8">
        <Text className="text-xl font-bold text-blue-900">
          Name: {displayName}
        </Text>
        <Text className="text-xl font-semibold  text-blue-900 mt-2">
          Email: {user?.email}
        </Text>
        <Text className="text-normL font-semibold  text-blue-900 mt-2">
          Last Seen: {formatDateTime(new Date(user?.accessedAt!))}
        </Text>
        <Text className="text-normal font-semibold  text-blue-900 mt-2">
          Created: {formatDateTime(new Date(user?.$createdAt!))}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
