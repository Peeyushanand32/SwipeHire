import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function MobileCandidateReviewScreen() {
  const candidates = [
    { id: '1', name: 'Rahul Sharma', headline: 'Full Stack React Developer', skills: ['React', 'Node.js'], city: 'Bangalore' },
    { id: '2', name: 'Priya Patel', headline: 'Backend Engineer', skills: ['PostgreSQL', 'Docker'], city: 'Mumbai' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Candidate Review</Text>
        <Text style={styles.subtitle}>Review applicants who swiped interested</Text>

        <View style={{ gap: 14 }}>
          {candidates.map((c) => (
            <View key={c.id} style={styles.card}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.headline}>{c.headline}</Text>

              <View style={styles.row}>
                {c.skills.map((s, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.passBtn} onPress={() => alert('Candidate passed')}>
                  <Text style={styles.passText}>Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shortlistBtn} onPress={() => alert('Candidate shortlisted!')}>
                  <Text style={styles.shortlistText}>Shortlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.msgBtn} onPress={() => alert('First message sent to candidate!')}>
                  <Text style={styles.msgText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8FF' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 12, color: '#464555', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E8E5FF', gap: 8 },
  name: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  headline: { fontSize: 12, color: '#464555' },
  row: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999, backgroundColor: '#EFECFF' },
  chipText: { fontSize: 10, fontWeight: '600', color: '#4F46E5' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  passBtn: { flex: 1, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E8E5FF', alignItems: 'center', justifyContent: 'center' },
  passText: { fontSize: 12, color: '#777587', fontWeight: '700' },
  shortlistBtn: { flex: 1, height: 38, borderRadius: 19, backgroundColor: '#EFECFF', alignItems: 'center', justifyContent: 'center' },
  shortlistText: { fontSize: 12, color: '#4F46E5', fontWeight: '700' },
  msgBtn: { flex: 1, height: 38, borderRadius: 19, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
  msgText: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
});
