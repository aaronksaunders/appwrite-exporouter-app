import { SessionProvider } from "@/context";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Import your global CSS file
import "../global.css";

/**
 * Root Layout is the highest-level layout in the app, wrapping all other layouts and screens.
 * It provides:
 * 1. Global authentication context via SessionProvider
 * 2. Gesture handling support for the entire app
 * 3. Global styles and configurations
 *
 * This layout affects every screen in the app, including both authenticated
 * and unauthenticated routes.
 */
export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      {/* 
        GestureHandlerRootView is required for:
        - Drawer navigation gestures
        - Swipe gestures
        - Other gesture-based interactions
        Must wrap the entire app to function properly
      */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 
          Slot renders child routes dynamically
          This includes both (app) and (auth) group routes
        */}
        <Slot />
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
