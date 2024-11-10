import { Image, StyleSheet, View, Text, Button } from "react-native";
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Hello World</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
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
