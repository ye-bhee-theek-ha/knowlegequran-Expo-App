import { Stack } from "expo-router";

export default function AppEntry() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="classes"
                options={{
                presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="meeting"
            />
        </Stack>
    )
}