import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';

const API_BASE = 'http://10.14.254.189:3000';

export default function MobileMatchesScreen({ navigation }: any) {
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
          <Text style={styles.emptyText}>Swipe right on jobs in the Discover feed to express interest!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation?.navigate?.('chat', { interestId: item.id })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.job.company.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.jobTitle}>{item.job.title}</Text>
                  {item.shortlisted && (
                    <View style={styles.shortlistBadge}>
                      <Text style={styles.shortlistText}>SHORTLISTED</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.companyName}>{item.job.company.name}</Text>
                <Text style={styles.statusText}>
                  {item.hasConversation ? 'Active Chat' : 'Waiting for recruiter message...'}
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
    backgroundColor: '#FCF8FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#464555',
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
    color: '#1A1A2E',
  },
  emptyText: {
    fontSize: 12,
    color: '#464555',
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5FF',
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
    color: '#1A1A2E',
  },
  companyName: {
    fontSize: 12,
    color: '#464555',
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  shortlistBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#F0FDF4',
  },
  shortlistText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#22C55E',
  },
});
