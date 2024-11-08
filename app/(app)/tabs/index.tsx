import { Image, StyleSheet, View, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useSession } from "@/context";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.stepContainer}>
        <Text>{JSON.stringify(session)}</Text>
        <Text
          onPress={async () => {
            console.log("logout");
            await signOut();
            router.replace("/sign-in");
          }}
        >
          LOGOUT
        </Text>
      </View>
    </ParallaxScrollView>
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
