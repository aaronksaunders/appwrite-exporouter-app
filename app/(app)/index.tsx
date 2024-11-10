import { Redirect, useRouter } from "expo-router";

export default function Index() {
  console.log("[app Index]");

  return <Redirect href="/(app)/(drawer)/(tabs)/" />;
}
