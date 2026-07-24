import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SeekerHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>JOB SEEKER EDITION</Text>
        </View>
        <Text style={styles.title}>Swipe. Match. Get Hired.</Text>
        <Text style={styles.subtitle}>
          Direct connection with verified employers. Swipe right on jobs you love, chat directly with hiring managers.
        </Text>
      </View>

      <View style={styles.cardSection}>
        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>🚀</Text>
          <Text style={styles.cardTitle}>Verified Jobs Deck</Text>
          <Text style={styles.cardDesc}>Browse curated software, design & tech roles tailored to your skills.</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardEmoji}>💬</Text>
          <Text style={styles.cardTitle}>Direct Employer Chat</Text>
          <Text style={styles.cardDesc}>No middle agencies. Talk straight to recruiters once matched.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/discover')}>
        <Text style={styles.buttonText}>Start Swiping Jobs →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  cardSection: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
