import { Stack } from 'expo-router';

export default function RecruiterLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="company-setup" options={{ title: 'Company KYC Setup' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Employer Console' }} />
      <Stack.Screen name="post-job" options={{ title: 'Post a New Job' }} />
      <Stack.Screen name="candidate-review" options={{ title: 'Candidate Review Queue' }} />
      <Stack.Screen name="chats" options={{ title: 'Candidate Messages' }} />
      <Stack.Screen name="company-profile" options={{ title: 'Company Profile & KYC' }} />
    </Stack>
  );
}
