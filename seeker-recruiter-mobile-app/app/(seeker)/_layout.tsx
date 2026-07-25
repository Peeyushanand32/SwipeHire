import { Stack } from 'expo-router';

export default function SeekerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="profile-setup" options={{ title: 'Complete Profile' }} />
      <Stack.Screen name="discover" options={{ title: 'Swipe Jobs' }} />
      <Stack.Screen name="matches" options={{ title: 'Matches & Chats' }} />
      <Stack.Screen name="profile" options={{ title: 'Seeker Profile' }} />
    </Stack>
  );
}
