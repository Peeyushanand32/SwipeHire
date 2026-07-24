import { Tabs } from 'expo-router';
import React from 'react';

export default function SeekerLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4F46E5', headerStyle: { backgroundColor: '#F8FAFC' } }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="login" options={{ title: 'Seeker Login', href: null }} />
      <Tabs.Screen name="signup" options={{ title: 'Seeker Sign Up', href: null }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover Jobs', tabBarLabel: 'Swipe Feed' }} />
      <Tabs.Screen name="matches" options={{ title: 'Matches & Chats', tabBarLabel: 'Matches' }} />
      <Tabs.Screen name="profile" options={{ title: 'My Profile', tabBarLabel: 'Profile' }} />
    </Tabs>
  );
}
