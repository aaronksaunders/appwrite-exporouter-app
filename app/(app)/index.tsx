import { useSession } from "@/context";
import { logout } from "@/lib/appwrite-service";
import { Redirect, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  console.log("[app Index]");

  return (

    <Redirect href="/(app)/tabs" />
  );
}
