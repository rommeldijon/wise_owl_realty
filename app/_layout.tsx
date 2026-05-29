// Root Expo Router layout: loads fonts, controls the splash screen, and provides global auth/user state.
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { GlobalProvider } from "@/lib/global-provider";
import "./global.css";



export default function RootLayout() {
   // Load custom Rubik fonts before rendering screens that depend on those font-family names.
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

   useEffect(() => {
    // Hide Expo's splash screen only after fonts are ready to prevent a visual flash.
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // GlobalProvider makes the logged-in user available to all Expo Router screens.
    <GlobalProvider>
    <Stack screenOptions={{ headerShown: false}}/>
    </GlobalProvider>
  )
}
