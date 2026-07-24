import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

const API_BASE = 'http://10.0.2.2:3000';

export default function MobileRecruiterDashboard({ navigation }: any) {
  const [kycStatus, setKycStatus] = useState('VERIFIED');
  const [jobCount, setJobCount] = useState(2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Recruiter Hub</Text>
        <Text style={styles.subtitle}>Mobile overview and candidate queue</Text>

        {/* KYC Banner */}
        <View style={[styles.banner, kycStatus === 'VERIFIED' ? styles.verifiedBanner : styles.pendingBanner]}>
          <Text style={styles.bannerTitle}>
            KYC Status: {kycStatus}
          </Text>
          <Text style={styles.bannerText}>
            {kycStatus === 'VERIFIED'
              ? 'Your company is verified. Jobs are active in candidate feeds.'
              : 'KYC review pending by Admin.'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{jobCount}</Text>
            <Text style={styles.statLabel}>Posted Jobs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Candidates Interested</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation?.navigate?.('post-job')}
        >
          <Text style={styles.actionText}>+ Post New Job</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B5C', marginTop: 10 }]}
          onPress={() => navigation?.navigate?.('candidate-review')}
        >
          <Text style={styles.actionText}>Review Candidate Queue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8FF' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 12, color: '#464555', marginBottom: 16 },
  banner: { padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  verifiedBanner: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  pendingBanner: { backgroundColor: '#FFFBEB', borderColor: '#F59E0B' },
  bannerTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A2E' },
  bannerText: { fontSize: 11, color: '#464555', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E8E5FF', alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#1A1A2E' },
  statLabel: { fontSize: 11, color: '#777587', marginTop: 2 },
  actionButton: { height: 48, borderRadius: 24, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
