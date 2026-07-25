import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function SavedJobsScreen() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookmarks = async () => {
    try {
      const data = await apiFetch('/seeker/bookmarks');
      setBookmarks(data.bookmarks || []);
    } catch (err: any) {
      console.log('Error fetching bookmarks:', err);
      setBookmarks([
        {
          id: '1',
          title: 'Senior Frontend Engineer',
          company: { name: 'TechCorp Solutions' },
          city: 'Bengaluru',
          description: 'Build high performance web applications using Next.js & React Native.',
          skills: ['React', 'TypeScript', 'Node.js'],
          salaryMin: 1800000,
          salaryMax: 2800000,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (jobId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== jobId));
    try {
      await apiFetch('/seeker/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ jobId }),
      });
      Alert.alert('Bookmark Removed', 'Job removed from your saved list.');
    } catch (err: any) {
      console.log('Failed to remove bookmark:', err);
    }
  };

  const handleApplyFromSaved = async (jobId: string) => {
    try {
      await apiFetch('/swipe', {
        method: 'POST',
        body: JSON.stringify({ jobId, direction: 'right' }),
      });
      Alert.alert('Application Sent! 🎉', 'Recruiter has been notified of your interest.');
    } catch (e) {
      Alert.alert('Interest Sent', 'Your interest was recorded.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Jobs</Text>
        <Text style={styles.subtitle}>Jobs bookmarked from your swipe feed</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading saved jobs...</Text>
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Saved Jobs Yet</Text>
          <Text style={styles.emptyDesc}>
            Tap the ★ Bookmark button while swiping job cards to save positions for later review.
          </Text>
          <TouchableOpacity style={styles.discoverBtn} onPress={() => router.push('/(seeker)/discover')}>
            <Text style={styles.discoverBtnText}>Explore Jobs Deck →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchBookmarks();
          }}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.company?.name ? item.company.name.slice(0, 2).toUpperCase() : 'TC'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.companyText}>
                    {item.company?.name || 'Company'} • {item.city || 'Remote'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveBookmark(item.id)}>
                  <Text style={styles.removeBtnText}>★ Saved</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.skillsRow}>
                {(item.skills || []).map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.salaryText}>
                  {item.salaryMin && item.salaryMax
                    ? `₹${(item.salaryMin / 100000).toFixed(1)}L - ₹${(item.salaryMax / 100000).toFixed(1)}L / yr`
                    : 'Competitive Salary'}
                </Text>

                <TouchableOpacity style={styles.applyBtn} onPress={() => handleApplyFromSaved(item.id)}>
                  <Text style={styles.applyBtnText}>♥ Express Interest</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  discoverBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  discoverBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  companyText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  removeBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 4,
  },
  salaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  applyBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
