import { Image, StyleSheet, View, Text, Button, Pressable } from "react-native";
import { useSession } from "@/context";
import { useRouter } from "expo-router";
import { logout } from "@/lib/appwrite-service";

export default function HomeScreen() {
  const router = useRouter();
  const { user, session } = useSession();

  const handleSignOut = async () => {
    try {
      await logout();
      return router.replace("/sign-in");
    } catch (err) {
      console.log("[handleSignOut] ==>", err);
      return null;
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }} className="bg-blue-400">
      <Text className="font-bold">Hello World</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Pressable
        className="border border-white w-24 rounded text-sm mt-2"
        onPress={handleSignOut}
      >
        <Text className="text-sm text-white font-bold mx-auto py-1">Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
