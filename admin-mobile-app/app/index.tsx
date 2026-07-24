import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthGuard } from '../lib/useAuthGuard';
import { clearAuthSession } from '../lib/auth';

export default function AdminDashboardScreen() {
  const { isAuthenticated } = useAuthGuard();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.adminHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PLATFORM MASTER CONSOLE</Text>
          </View>
          <Text style={styles.title}>System Overview</Text>
          <Text style={styles.subtitle}>SwipeHire real-time metrics & moderation status</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardVal}>1,248</Text>
            <Text style={styles.cardLbl}>Total Registered Seekers</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardVal}>184</Text>
            <Text style={styles.cardLbl}>Verified Companies</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardVal, { color: '#FF6B5C' }]}>6</Text>
            <Text style={styles.cardLbl}>Pending KYCs</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardVal, { color: '#10B981' }]}>₹4.8L</Text>
            <Text style={styles.cardLbl}>Monthly Revenue</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>SYSTEM HEALTH</Text>
          <View style={styles.healthRow}>
            <Text style={styles.healthLbl}>Database & API status</Text>
            <Text style={styles.onlineBadge}>● Operational</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLbl}>Interest Expiry Cron Jobs</Text>
            <Text style={styles.onlineBadge}>● Active (v2.1)</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLbl}>Realtime Chat Socket</Text>
            <Text style={styles.onlineBadge}>● Connected</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await clearAuthSession();
            Alert.alert('Logged Out', 'Master Admin session closed.');
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutText}>Close Admin Master Session</Text>
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
  adminHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#FF6B5C',
    fontSize: 10,
    fontWeight: '800',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4F46E5',
  },
  cardLbl: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  secTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  healthLbl: {
    fontSize: 13,
    color: '#334155',
  },
  onlineBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  logoutBtn: {
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
