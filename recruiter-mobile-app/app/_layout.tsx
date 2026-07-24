import { Tabs } from 'expo-router';
import React from 'react';

export default function RecruiterLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#7C6CF0', headerStyle: { backgroundColor: '#F8FAFC' } }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarLabel: 'Dashboard' }} />
      <Tabs.Screen name="login" options={{ title: 'Employer Login', href: null }} />
      <Tabs.Screen name="signup" options={{ title: 'Employer Sign Up', href: null }} />
      <Tabs.Screen name="candidate-review" options={{ title: 'Candidate Deck', tabBarLabel: 'Candidates' }} />
      <Tabs.Screen name="post-job" options={{ title: 'Post a Job', tabBarLabel: '+ Post Job' }} />
      <Tabs.Screen name="chats" options={{ title: 'Candidate Chats', tabBarLabel: 'Chats' }} />
    </Tabs>
  );
}
