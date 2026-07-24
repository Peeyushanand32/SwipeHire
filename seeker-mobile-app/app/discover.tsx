import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuthGuard } from '../lib/useAuthGuard';

const API_BASE = 'http://10.14.254.189:3000';

export default function SeekerDiscoverScreen() {
  const { isAuthenticated } = useAuthGuard();
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/feed`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.log('Error fetching mobile feed:', err);
      // Fallback sample data if server not reachable offline
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
      await fetch(`${API_BASE}/api/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <Text style={styles.headerTitle}>Discover Jobs</Text>
        <Text style={styles.headerSubtitle}>Verified employer card deck</Text>
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

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.passButton} onPress={() => handleSwipe('left')}>
                <Text style={styles.passText}>✕ Pass</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.likeButton} onPress={() => handleSwipe('right')}>
                <Text style={styles.likeText}>♥ Apply / Interest</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    backgroundColor: '#4F46E5',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#DCFCE7',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  contentBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 8,
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
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  passButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  passText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14,
  },
  likeButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  likeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
