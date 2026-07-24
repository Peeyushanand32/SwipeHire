import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { clearAuthSession } from '../lib/auth';
import { useAuthGuard } from '../lib/useAuthGuard';

export default function RecruiterDashboardScreen() {
  const { isAuthenticated, user } = useAuthGuard();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.companyHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RECRUITER CONSOLE</Text>
          </View>
          <Text style={styles.title}>TechCorp Solutions</Text>
          <Text style={styles.statusText}>✓ Verified Employer • Pro Subscription</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Job Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>148</Text>
            <Text style={styles.statLabel}>Interested Seekers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Matches Made</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Chats</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/post-job')}>
          <Text style={styles.actionText}>+ Post New Job Opening</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/candidate-review')}>
          <Text style={styles.secondaryActionText}>⚡ Review Candidate Cards →</Text>
        </TouchableOpacity>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>ACTIVE JOB POSTINGS</Text>
          <View style={styles.jobRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>Senior Frontend Engineer</Text>
              <Text style={styles.jobMeta}>Bengaluru • ₹18L - ₹28L</Text>
            </View>
            <View style={styles.applicantBadge}>
              <Text style={styles.applicantText}>42 Applicants</Text>
            </View>
          </View>

          <View style={styles.jobRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>React Native Mobile Developer</Text>
              <Text style={styles.jobMeta}>Remote / Delhi • ₹15L - ₹22L</Text>
            </View>
            <View style={styles.applicantBadge}>
              <Text style={styles.applicantText}>28 Applicants</Text>
            </View>
          </View>
        </View>

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
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 4,
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
  recentSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  jobMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  applicantBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  applicantText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14,
  },
});
