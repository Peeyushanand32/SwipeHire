import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function RecruiterCandidateReviewScreen() {
  const [candidates, setCandidates] = useState([
    {
      id: 'c1',
      name: 'John Seeker',
      headline: 'Full Stack Engineer',
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      expectedSalary: 2200000,
      city: 'Bengaluru',
    },
    {
      id: 'c2',
      name: 'Priya Sharma',
      headline: 'Mobile UI/UX & React Native Dev',
      skills: ['React Native', 'Expo', 'Figma', 'Tailwind'],
      expectedSalary: 1800000,
      city: 'Delhi NCR',
    }
  ]);
  const [index, setIndex] = useState(0);

  const handleAction = (type: 'shortlist' | 'pass') => {
    setIndex((prev) => prev + 1);
  };

  const currentCandidate = candidates[index];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Candidate Review</Text>
        <Text style={styles.headerSubtitle}>Swipe right to shortlist candidates for Senior Frontend Engineer</Text>
      </View>

      {!currentCandidate ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>All Candidates Reviewed!</Text>
          <Text style={styles.emptySubtitle}>You have reviewed all applicants for this job opening.</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setIndex(0)}>
            <Text style={styles.resetText}>Review Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentCandidate.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <Text style={styles.candidateName}>{currentCandidate.name}</Text>
              <Text style={styles.headline}>{currentCandidate.headline}</Text>
              <Text style={styles.cityText}>📍 {currentCandidate.city}</Text>
            </View>

            <View style={styles.detailsBody}>
              <Text style={styles.sectionTitle}>CANDIDATE SKILLS</Text>
              <View style={styles.skillsRow}>
                {currentCandidate.skills.map((s, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>EXPECTED CTC</Text>
              <Text style={styles.salaryText}>
                ₹{currentCandidate.expectedSalary.toLocaleString()} / yr
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.passBtn} onPress={() => handleAction('pass')}>
                <Text style={styles.passText}>✕ Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortlistBtn} onPress={() => handleAction('shortlist')}>
                <Text style={styles.shortlistText}>♥ Shortlist & Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  cardContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 3,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  cityText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  detailsBody: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    color: '#7C6CF0',
    fontSize: 12,
    fontWeight: '700',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  passBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  passText: {
    color: '#EF4444',
    fontWeight: '800',
  },
  shortlistBtn: {
    flex: 2,
    backgroundColor: '#7C6CF0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  shortlistText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emptyCard: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
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
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#7C6CF0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  resetText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
