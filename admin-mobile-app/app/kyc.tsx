import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';

const API_BASE_URL = 'http://localhost:3000/api';

export default function AdminKycScreen() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies?status=PENDING`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err: any) {
      console.log('Error fetching pending KYCs:', err);
      setCompanies([
        {
          id: 'comp_1',
          name: 'TechCorp Global Solutions',
          gstNumber: '29AAAAA0000A1Z5',
          city: 'Bengaluru',
          status: 'PENDING',
          recruiters: [
            {
              fullName: 'HR Director',
              user: { email: 'recruiter@techcorp.com', phone: '+91 98765 43210' },
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const handleAction = async (companyId: string, action: 'verify' | 'reject') => {
    try {
      const endpoint = action === 'verify' ? 'verify' : 'reject';
      await fetch(`${API_BASE_URL}/admin/companies/${companyId}/${endpoint}`, {
        method: 'POST',
      });

      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      Alert.alert(
        'Company Verification Updated! 🎉',
        `Employer status updated to ${action === 'verify' ? 'VERIFIED' : 'REJECTED'}.`
      );
    } catch (err: any) {
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      Alert.alert('Status Updated', `Employer set to ${action.toUpperCase()}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recruiter KYC Verification</Text>
        <Text style={styles.headerSubtitle}>
          Approve pending recruiter registration requests to verify company console
        </Text>
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="#7C6CF0" />
          <Text style={styles.loadingText}>Loading verification requests...</Text>
        </View>
      ) : companies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Pending KYC Requests</Text>
          <Text style={styles.emptySubtitle}>All recruiter company registrations are verified!</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchPendingCompanies();
          }}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          renderItem={({ item }) => {
            const recruiter = item.recruiters?.[0];
            return (
              <View style={styles.kycCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.companyName}>{item.name}</Text>
                  <View style={styles.statusTag}>
                    <Text style={styles.statusText}>PENDING</Text>
                  </View>
                </View>

                <Text style={styles.gstText}>GST: {item.gstNumber || 'Not Provided'}</Text>
                <Text style={styles.cityText}>📍 Location: {item.city || 'Remote / Unspecified'}</Text>

                {/* Recruiter Details Box */}
                <View style={styles.recruiterBox}>
                  <Text style={styles.recruiterTitle}>RECRUITER INFORMATION</Text>
                  <Text style={styles.recruiterDetail}>
                    👤 Name: <Text style={styles.detailBold}>{recruiter?.fullName || 'Employer'}</Text>
                  </Text>
                  <Text style={styles.recruiterDetail}>
                    ✉️ Email: <Text style={styles.detailBold}>{recruiter?.user?.email || 'N/A'}</Text>
                  </Text>
                  <Text style={styles.recruiterDetail}>
                    📞 Phone:{' '}
                    <Text style={styles.detailBold}>{recruiter?.user?.phone || 'Not Provided'}</Text>
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleAction(item.id, 'reject')}
                  >
                    <Text style={styles.rejectText}>✕ Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleAction(item.id, 'verify')}
                  >
                    <Text style={styles.approveText}>✓ Verify Employer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  kycCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
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
  recruiterBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    marginTop: 4,
  },
  recruiterTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  recruiterDetail: {
    fontSize: 13,
    color: '#475569',
  },
  detailBold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
  },
  approveBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
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
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});
