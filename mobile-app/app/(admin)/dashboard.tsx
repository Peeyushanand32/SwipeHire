import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function MobileAdminDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Admin KPI Overview</Text>
        <Text style={styles.subtitle}>Mobile read-only platform monitoring</Text>

        <View style={styles.grid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNum}>148</Text>
            <Text style={styles.kpiLabel}>Total Registered Users</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNum, { color: '#F59E0B' }]}>3</Text>
            <Text style={styles.kpiLabel}>Pending KYC Verification</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiNum}>42</Text>
            <Text style={styles.kpiLabel}>Active Job Listings</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNum, { color: '#FF6B5C' }]}>1,240</Text>
            <Text style={styles.kpiLabel}>Total Swipes Made</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            💡 Admin KYC approvals and detailed reporting are recommended on the Desktop Web Control Panel.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: '#C7C4D8', marginBottom: 16 },
  grid: { gap: 12 },
  kpiCard: { backgroundColor: '#2F2E43', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#464555' },
  kpiNum: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  kpiLabel: { fontSize: 12, color: '#C7C4D8', marginTop: 4 },
  notice: { marginTop: 20, padding: 14, borderRadius: 16, backgroundColor: '#2F2E43', borderWidth: 1, borderColor: '#464555' },
  noticeText: { fontSize: 11, color: '#C7C4D8', lineHeight: 16 },
});
