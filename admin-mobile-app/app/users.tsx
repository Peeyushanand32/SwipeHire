import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

export default function AdminUsersScreen() {
  const users = [
    { id: 'u1', name: 'John Seeker', role: 'SEEKER', email: 'john@example.com', status: 'ACTIVE' },
    { id: 'u2', name: 'HR TechCorp', role: 'RECRUITER', email: 'hr@techcorp.com', status: 'ACTIVE' },
    { id: 'u3', name: 'Admin Control', role: 'ADMIN', email: 'admin@swipehire.com', status: 'ACTIVE' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User & Role Moderation</Text>
        <Text style={styles.headerSubtitle}>Manage user accounts across all 3 SwipeHire apps</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  email: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
});
