import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function MobileLandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Brand Icon */}
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.title}>SwipeHire</Text>
        <Text style={styles.subtitle}>
          Direct career matching platform. Choose how you want to continue below:
        </Text>

        {/* 2 Dedicated Role Cards as requested */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Job Seeker */}
          <TouchableOpacity
            style={styles.roleCardSeeker}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/login', params: { role: 'SEEKER' } })}
          >
            <View style={styles.roleBadgeSeeker}>
              <Text style={styles.roleBadgeText}>👤 JOB SEEKER</Text>
            </View>
            <Text style={styles.cardTitle}>Looking for a Job</Text>
            <Text style={styles.cardDesc}>
              Swipe right on verified company jobs, get shortlisted, and chat directly with hiring managers.
            </Text>
            <View style={styles.actionBtnSeeker}>
              <Text style={styles.actionBtnText}>Continue as Job Seeker →</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Recruiter / Employer */}
          <TouchableOpacity
            style={styles.roleCardRecruiter}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/login', params: { role: 'RECRUITER' } })}
          >
            <View style={styles.roleBadgeRecruiter}>
              <Text style={styles.roleBadgeText}>💼 RECRUITER / EMPLOYER</Text>
            </View>
            <Text style={styles.cardTitle}>Hiring Candidates</Text>
            <Text style={styles.cardDesc}>
              Post job listings, review applicant profiles, swipe right on candidates, and start instant conversations.
            </Text>
            <View style={styles.actionBtnRecruiter}>
              <Text style={styles.actionBtnText}>Continue as Recruiter →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to SwipeHire? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Create an Account</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  cardsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 32,
  },
  roleCardSeeker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#EEF2FF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  roleBadgeSeeker: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 12,
  },
  roleCardRecruiter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#F5F3FF',
    shadowColor: '#7C6CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  roleBadgeRecruiter: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 20,
  },
  actionBtnSeeker: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnRecruiter: {
    backgroundColor: '#7C6CF0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  signupLink: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
});
