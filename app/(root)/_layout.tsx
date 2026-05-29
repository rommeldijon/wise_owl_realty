// Protected route layout: blocks authenticated app screens until the current user has been loaded.
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
    const { loading, isLoggedIn } =  useGlobalContext();
    // Keep protected routes blank except for a spinner while checking the current Appwrite session.
    if (loading) {
        return (
        <SafeAreaView className="bg-white h-full flex justify-center items-center">
            <ActivityIndicator className="text-primary-300" size="large" />
        </SafeAreaView>
        );
    }
    // Logged-out users cannot access the tab/property screens, so redirect them to sign in.
    if (!isLoggedIn) {
        return <Redirect href="/sign-in" />;
    }

    return <Slot />;

}