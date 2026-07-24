import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

export default function RecruiterChatsScreen() {
  const conversations = [
    {
      id: 'rc1',
      candidateName: 'John Seeker',
      appliedJob: 'Senior Frontend Engineer',
      lastMsg: 'Hello! I am excited about the Senior Frontend role.',
      time: '10:30 AM',
    },
    {
      id: 'rc2',
      candidateName: 'Priya Sharma',
      appliedJob: 'React Native Developer',
      lastMsg: 'Shared my GitHub portfolio link.',
      time: 'Yesterday',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Candidate Conversations</Text>
        <Text style={styles.headerSubtitle}>Direct messages with shortlisted applicants</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.candidateName.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.name}>{item.candidateName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.jobText}>Role: {item.appliedJob}</Text>
              <Text style={styles.lastMsg} numberOfLines={1}>
                {item.lastMsg}
              </Text>
            </View>
          </TouchableOpacity>
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
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  jobText: {
    fontSize: 11,
    color: '#7C6CF0',
    fontWeight: '700',
    marginTop: 1,
  },
  lastMsg: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  time: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
