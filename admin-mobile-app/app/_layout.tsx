import { Tabs } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF6B5C', headerStyle: { backgroundColor: '#F8FAFC' } }}>
      <Tabs.Screen name="index" options={{ title: 'KPI Overview', tabBarLabel: 'Metrics' }} />
      <Tabs.Screen name="login" options={{ title: 'Admin Login', href: null }} />
      <Tabs.Screen name="kyc" options={{ title: 'KYC Approvals', tabBarLabel: 'KYCs' }} />
      <Tabs.Screen name="users" options={{ title: 'User & Jobs', tabBarLabel: 'Moderation' }} />
    </Tabs>
  );
}
