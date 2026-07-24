import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuthGuard } from '../lib/useAuthGuard';

const API_BASE = 'http://10.14.254.189:3000';

export default function SeekerMatchesScreen() {
  const { isAuthenticated } = useAuthGuard();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/matches`);
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.log(err);
        setMatches([
          {
            id: 'm1',
            job: { title: 'Senior Frontend Engineer', company: { name: 'TechCorp Solutions' } },
            lastMessage: 'Hey! We loved your profile. Are you free for a call tomorrow?',
            updatedAt: '10:45 AM',
          },
          {
            id: 'm2',
            job: { title: 'React Native Developer', company: { name: 'InnovateX Labs' } },
            lastMessage: 'Your interest has been accepted by recruiter!',
            updatedAt: 'Yesterday',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches & Chats</Text>
        <Text style={styles.headerSubtitle}>Swiped opportunities & active conversations</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>Keep swiping on job cards in Discover to unlock conversations!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.matchCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.job?.company?.name?.slice(0, 2).toUpperCase() || 'TC'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.jobTitle}>{item.job?.title || 'Position'}</Text>
                  <Text style={styles.timeText}>{item.updatedAt || 'Now'}</Text>
                </View>

                <Text style={styles.companyName}>{item.job?.company?.name || 'Company'}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage || 'Connected on SwipeHire'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  companyName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  lastMessage: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
