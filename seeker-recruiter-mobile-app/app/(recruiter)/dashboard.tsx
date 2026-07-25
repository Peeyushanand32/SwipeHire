import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { clearAuthSession, getAuthUser } from '../../lib/auth';
import { apiFetch } from '../../lib/api';

export default function RecruiterDashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const authUser = await getAuthUser();
      setUser(authUser);

      const compData = await apiFetch('/company/profile');
      setCompany(compData.company);
    } catch (err) {
      console.log('Error fetching recruiter company details:', err);
      // Fallback display state
      setCompany({
        name: user?.recruiterProfile?.company?.name || 'Your Company',
        status: 'PENDING', // PENDING or VERIFIED
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isVerified = company?.status === 'VERIFIED';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RECRUITER CONSOLE</Text>
          </View>
          <Text style={styles.title}>{company?.name || 'Company Account'}</Text>
          
          {/* Status Badge */}
          {isVerified ? (
            <Text style={styles.verifiedStatusText}>✓ Verified Employer • Jobs Live on Seekers Feed</Text>
          ) : (
            <View style={styles.pendingBanner}>
              <Text style={styles.pendingTitle}>⏳ Verification Pending from Admin</Text>
              <Text style={styles.pendingDesc}>
                Your company details are under review by Admin (App & Website). Posted jobs will go live once verified.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Metrics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>148</Text>
            <Text style={styles.statLabel}>Interested Seekers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Shortlisted Matches</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Chats</Text>
          </View>
        </View>

        {/* Post Job Action */}
        <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/(recruiter)/post-job')}>
          <Text style={styles.actionText}>+ Post New Job Opening</Text>
        </TouchableOpacity>

        {/* View All Posted Jobs Action */}
        <TouchableOpacity style={styles.myJobsAction} onPress={() => router.push('/(recruiter)/my-jobs')}>
          <Text style={styles.myJobsActionText}>📋 View All Posted Jobs →</Text>
        </TouchableOpacity>

        {/* Candidate Messages Action */}
        <TouchableOpacity style={styles.chatsAction} onPress={() => router.push('/(recruiter)/chats')}>
          <Text style={styles.chatsActionText}>💬 Candidate Messages & Initiate Chats →</Text>
        </TouchableOpacity>

        {/* Candidate Review Action */}
        <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/(recruiter)/candidate-review')}>
          <Text style={styles.secondaryActionText}>⚡ Review Candidate Cards →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await clearAuthSession();
            Alert.alert('Logged Out', 'You have been logged out of your Employer account.');
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutText}>Log Out from Employer Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  companyHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#7C6CF0',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  verifiedStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 6,
  },
  pendingBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  pendingTitle: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '800',
  },
  pendingDesc: {
    color: '#B45309',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#7C6CF0',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  primaryAction: {
    backgroundColor: '#7C6CF0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  myJobsAction: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  myJobsActionText: {
    color: '#7C6CF0',
    fontSize: 14,
    fontWeight: '800',
  },
  chatsAction: {
    backgroundColor: '#7C6CF0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  chatsActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryAction: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '800',
  },
  logoutButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
