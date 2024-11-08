import { router } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useSession } from "@/context";

export default function SignIn() {
  console.log("[SignIn]");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useSession();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (err) {
      console.log("[handleLogin] ==>", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="name@mail.com"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
        keyboardType="email-address"
        style={{
          padding: 8,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 8,
          fontSize: 16,
          width: 230,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="emailAddress"
        style={{
          padding: 8,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 8,
          fontSize: 16,
          width: 230,
          marginBottom: 32,
        }}
      />
      <Text
        style={{
          backgroundColor: "lightblue",
          fontSize: 16,
          marginBottom: 32,
          borderWidth: 1,
          borderColor: "lightblue",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          fontWeight: "bold",
        }}
        onPress={() => {
          handleLogin();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/");
        }}
      >
        Sign In
      </Text>
    </View>
  );
}
