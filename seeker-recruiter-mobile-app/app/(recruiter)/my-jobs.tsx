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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function MyJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyJobs = async () => {
    try {
      const data = await apiFetch('/jobs');
      setJobs(data.jobs || []);
    } catch (err: any) {
      console.log('Error fetching posted jobs:', err);
      // Fallback offline mock data if server unavailable
      setJobs([
        {
          id: 'j1',
          title: 'Senior Frontend Engineer',
          city: 'Bengaluru',
          salaryMin: 1800000,
          salaryMax: 2800000,
          isActive: true,
          applicantCount: 14,
          skills: ['React', 'Next.js', 'TypeScript'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'j2',
          title: 'Full Stack Node.js Developer',
          city: 'Remote / Delhi',
          salaryMin: 1200000,
          salaryMax: 2000000,
          isActive: false,
          applicantCount: 8,
          skills: ['Node.js', 'Express', 'Prisma'],
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, isActive: newStatus } : job))
    );

    try {
      await apiFetch(`/jobs/${jobId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: newStatus }),
      });
      Alert.alert(
        'Job Status Updated',
        newStatus ? 'Job is now ACTIVE and visible on Seeker feed.' : 'Job is PAUSED.'
      );
    } catch (err: any) {
      console.log('Failed to update job status:', err);
    }
  };

  const handleDeleteJob = (jobId: string, title: string) => {
    Alert.alert('Delete Job Listing', `Are you sure you want to remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setJobs((prev) => prev.filter((j) => j.id !== jobId));
          try {
            await apiFetch(`/jobs/${jobId}`, { method: 'DELETE' });
          } catch (e) {
            console.log(e);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Posted Jobs</Text>
        <Text style={styles.subtitle}>Manage your company active & paused job openings</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C6CF0" />
          <Text style={styles.loadingText}>Loading company openings...</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
          <Text style={styles.emptyDesc}>
            Post your first job opening to start matching with verified candidates.
          </Text>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => router.push('/(recruiter)/post-job')}
          >
            <Text style={styles.postBtnText}>+ Create Job Opening</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchMyJobs();
          }}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.locationText}>📍 {item.city || 'Remote / Unspecified'}</Text>
                </View>
                <View style={[styles.statusBadge, item.isActive ? styles.badgeActive : styles.badgePaused]}>
                  <Text style={[styles.statusBadgeText, item.isActive ? styles.textActive : styles.textPaused]}>
                    {item.isActive ? 'ACTIVE' : 'PAUSED'}
                  </Text>
                </View>
              </View>

              {/* Skills */}
              <View style={styles.skillsRow}>
                {(item.skills || []).map((skill: string, idx: number) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Salary & Applicants */}
              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.infoLabel}>SALARY RANGE</Text>
                  <Text style={styles.salaryText}>
                    {item.salaryMin && item.salaryMax
                      ? `₹${(item.salaryMin / 100000).toFixed(1)}L - ₹${(item.salaryMax / 100000).toFixed(1)}L / yr`
                      : 'Not Specified'}
                  </Text>
                </View>

                <View style={styles.applicantsContainer}>
                  <Text style={styles.applicantsNumber}>{item.applicantCount || 0}</Text>
                  <Text style={styles.applicantsLabel}>Applicants</Text>
                </View>
              </View>

              {/* Controls */}
              <View style={styles.cardActions}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Live Feed Visibility:</Text>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => handleToggleStatus(item.id, item.isActive)}
                    trackColor={{ false: '#CBD5E1', true: '#C4B5FD' }}
                    thumbColor={item.isActive ? '#7C6CF0' : '#94A3B8'}
                  />
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteJob(item.id, item.title)}
                >
                  <Text style={styles.deleteBtnText}>🗑 Delete</Text>
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
  postBtn: {
    backgroundColor: '#7C6CF0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: '#DCFCE7',
  },
  badgePaused: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  textActive: {
    color: '#16A34A',
  },
  textPaused: {
    color: '#64748B',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C6CF0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  salaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  applicantsContainer: {
    alignItems: 'flex-end',
  },
  applicantsNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7C6CF0',
  },
  applicantsLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
