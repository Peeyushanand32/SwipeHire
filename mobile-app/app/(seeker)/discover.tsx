import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

const API_BASE = 'http://10.14.254.189:3000'; // Android emulator localhost alias or server IP

export default function MobileDiscoverScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // In production, token is loaded via SecureStore
      const res = await fetch(`${API_BASE}/api/feed`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.log('Error fetching mobile feed:', err);
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
            {/* Header */}
            <View style={styles.companyHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentJob.company.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{currentJob.title}</Text>
                <Text style={styles.companyName}>
                  {currentJob.company.name} • {currentJob.city || 'Remote'}
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
                  : 'Competitive Salary'}
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.passButton}
                onPress={() => handleSwipe('left')}
              >
                <Text style={styles.passText}>✕</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleSwipe('right')}
              >
                <Text style={styles.likeText}>♥</Text>
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
  loadingText: {
    fontSize: 12,
    color: '#777587',
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
    color: '#1A1A2E',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#464555',
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
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECFF',
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
    color: '#1A1A2E',
  },
  companyName: {
    fontSize: 12,
    color: '#464555',
    marginTop: 2,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#F0FDF4',
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#22C55E',
  },
  contentBody: {
    marginVertical: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#777587',
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    color: '#464555',
    lineHeight: 18,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#EFECFF',
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFECFF',
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D97706',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B5C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  likeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
