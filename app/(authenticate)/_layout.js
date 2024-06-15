import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="otpVerification" />
        <Stack.Screen name="selectGender" />
        <Stack.Screen name="profileDetails" />
        <Stack.Screen name="selectInrests" />
      </Stack>
    </>
  );
}
