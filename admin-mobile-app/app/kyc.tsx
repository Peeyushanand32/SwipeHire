import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

export default function AdminKycScreen() {
  const [kycs, setKycs] = useState([
    { id: 'k1', companyName: 'InnovateX Labs', gst: '29ABCDE1234F1Z5', city: 'Bengaluru', status: 'PENDING' },
    { id: 'k2', companyName: 'CloudScale Technologies', gst: '07AAACC9999K1Z2', city: 'Delhi NCR', status: 'PENDING' },
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    Alert.alert('KYC Updated', `Company GST status marked as ${action.toUpperCase()}`);
    setKycs((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Company GST Approvals</Text>
        <Text style={styles.headerSubtitle}>Verify employer credentials before enabling job posting</Text>
      </View>

      {kycs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Pending KYCs</Text>
          <Text style={styles.emptySubtitle}>All company registrations have been processed!</Text>
        </View>
      ) : (
        <FlatList
          data={kycs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.kycCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.companyName}>{item.companyName}</Text>
                <View style={styles.statusTag}>
                  <Text style={styles.statusText}>PENDING</Text>
                </View>
              </View>

              <Text style={styles.gstText}>GST: {item.gst}</Text>
              <Text style={styles.cityText}>Location: {item.city}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleAction(item.id, 'reject')}
                >
                  <Text style={styles.rejectText}>✕ Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleAction(item.id, 'approve')}
                >
                  <Text style={styles.approveText}>✓ Approve KYC</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  kycCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  gstText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  cityText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectText: {
    color: '#EF4444',
    fontWeight: '800',
  },
  approveBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  empty: {
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
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});
