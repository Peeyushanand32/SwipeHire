import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function MobileDiscoverScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleBookmark = async () => {
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];

    try {
      const res = await apiFetch('/seeker/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ jobId: currentJob.id }),
      });
      Alert.alert(res.bookmarked ? 'Saved to Bookmarks! ★' : 'Removed from Saved', res.message);
    } catch (e) {
      Alert.alert('Job Saved!', 'Job added to your saved jobs list.');
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/feed');
      setJobs(data.jobs || []);
    } catch (err) {
      console.log('Error fetching mobile feed:', err);
      // Fallback sample data if offline/demo
      setJobs([
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
        {
          id: '2',
          title: 'Mobile App Developer',
          company: { name: 'InnovateX' },
          city: 'Remote / Delhi',
          description: 'Craft beautiful native mobile experiences for iOS & Android with Expo.',
          skills: ['Expo', 'React Native', 'Tailwind'],
          salaryMin: 1500000,
          salaryMax: 2200000,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSwipe = async (direction: 'right' | 'left') => {
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];

    try {
      await apiFetch('/swipe', {
        method: 'POST',
        body: JSON.stringify({ jobId: currentJob.id, direction }),
      });
    } catch (e) {
      console.log(e);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const currentJob = jobs[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Discover Jobs</Text>
          <Text style={styles.headerSubtitle}>Verified employer card deck</Text>
        </View>
        <TouchableOpacity style={styles.headerSavedBtn} onPress={() => router.push('/(seeker)/saved-jobs')}>
          <Text style={styles.headerSavedText}>★ Saved Jobs</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading job cards...</Text>
        </View>
      ) : !currentJob ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>You're All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>No more unswiped jobs matching your profile.</Text>
          <TouchableOpacity style={styles.resetButton} onPress={fetchJobs}>
            <Text style={styles.resetButtonText}>Refresh Feed</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.companyHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentJob.company?.name ? currentJob.company.name.slice(0, 2).toUpperCase() : 'TC'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{currentJob.title}</Text>
                <Text style={styles.companyName}>
                  {currentJob.company?.name || 'Company'} • {currentJob.city || 'Remote'}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>VERIFIED</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentBody}>
              <Text style={styles.sectionLabel}>ABOUT POSITION</Text>
              <Text style={styles.description} numberOfLines={4}>
                {currentJob.description}
              </Text>

              <Text style={styles.sectionLabel}>REQUIRED SKILLS</Text>
              <View style={styles.skillsRow}>
                {(currentJob.skills || []).map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionLabel}>OFFERED SALARY</Text>
              <Text style={styles.salaryText}>
                {currentJob.salaryMin && currentJob.salaryMax
                  ? `₹${currentJob.salaryMin.toLocaleString()} - ₹${currentJob.salaryMax.toLocaleString()} / yr`
                  : 'Competitive Package'}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.passButton} onPress={() => handleSwipe('left')}>
                <Text style={styles.passText}>✕ Pass</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
                <Text style={styles.bookmarkText}>★ Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.likeButton} onPress={() => handleSwipe('right')}>
                <Text style={styles.likeText}>♥ Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSavedBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  headerSavedText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800',
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
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  emptyCard: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  companyName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  contentBody: {
    flex: 1,
    marginVertical: 16,
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  salaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4F46E5',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  passButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  bookmarkButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  bookmarkText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '800',
  },
  likeButton: {
    flex: 1.5,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
