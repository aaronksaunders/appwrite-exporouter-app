import { Text } from "react-native";
import { Redirect, Stack, Slot } from "expo-router";
import { useSession } from "@/context";

/**
 * AppLayout serves as the root authentication wrapper for the main app routes.
 * It ensures:
 * 1. Protected routes are only accessible to authenticated users
 * 2. Loading states are handled appropriately
 * 3. Unauthenticated users are redirected to sign-in
 *
 * This layout wraps all routes within the (app) directory, but not (auth) routes,
 * allowing authentication flows to remain accessible.
 */
export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    // Show loading state while session is being checked
    // Consider replacing with a proper LoadingScreen component
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("[AppLayout] Redirecting to /sign-in");
    return <Redirect href="/sign-in" />;
  }

  // Render the child route once authentication is confirmed
  // The Slot component is used instead of Stack.Screen as this is a group layout
  return <Slot />;
}
