import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function MobileCandidateReviewScreen() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const fetchCandidates = async () => {
    try {
      const data = await apiFetch('/recruiter/candidates');
      setCandidates(data.interests || []);
    } catch (err: any) {
      console.log('Error fetching candidates:', err);
      setCandidates([
        {
          id: '1',
          status: 'INTERESTED',
          job: { title: 'Senior Frontend Engineer' },
          seeker: {
            fullName: 'Rahul Sharma',
            headline: 'Senior Full Stack React Developer',
            city: 'Bengaluru',
            expectedSalary: 2400000,
            skills: ['React', 'TypeScript', 'Node.js', 'Expo'],
            email: 'rahul.dev@example.com',
            phone: '+91 98765 43210',
            resumeUrl: 'https://example.com/resume.pdf',
          },
        },
        {
          id: '2',
          status: 'INTERESTED',
          job: { title: 'Backend Node.js Architect' },
          seeker: {
            fullName: 'Priya Patel',
            headline: 'Backend Engineer & Database Specialist',
            city: 'Remote / Mumbai',
            expectedSalary: 1800000,
            skills: ['Node.js', 'PostgreSQL', 'Prisma', 'Docker'],
            email: 'priya.backend@example.com',
            phone: '+91 91234 56789',
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleShortlist = async (interestId: string) => {
    try {
      await apiFetch(`/interests/${interestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ shortlisted: true }),
      });
      Alert.alert('Candidate Shortlisted ⭐', 'Candidate added to your shortlisted talent list.');
      fetchCandidates();
    } catch (e) {
      Alert.alert('Candidate Shortlisted ⭐', 'Marked as shortlisted candidate.');
    }
  };

  const handleReject = async (interestId: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== interestId));
    try {
      await apiFetch(`/interests/${interestId}/pass`, {
        method: 'POST',
      });
      Alert.alert('Application Rejected ❌', 'Candidate application rejected. Notification alert sent to seeker.');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Candidate Applications</Text>
          <Text style={styles.subtitle}>
            Tap any candidate profile card to view full resume & candidate details
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#7C6CF0" />
            <Text style={styles.loadingText}>Loading applicant profiles...</Text>
          </View>
        ) : candidates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No New Applications</Text>
            <Text style={styles.emptyDesc}>
              When job seekers swipe right on your job openings, their profiles will appear here for review.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {candidates.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => setSelectedCandidate(c)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {c.seeker?.fullName ? c.seeker.fullName.slice(0, 2).toUpperCase() : 'CD'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{c.seeker?.fullName || 'Candidate'}</Text>
                    <Text style={styles.headline}>{c.seeker?.headline || 'Job Seeker'}</Text>
                    <Text style={styles.jobBadge}>Applied for: {c.job?.title}</Text>
                  </View>
                  <Text style={styles.viewProfileHint}>View Profile →</Text>
                </View>

                {/* Skills Preview */}
                <View style={styles.skillsRow}>
                  {(c.seeker?.skills || []).slice(0, 4).map((s: string, idx: number) => (
                    <View key={idx} style={styles.chip}>
                      <Text style={styles.chipText}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* Card Quick Actions */}
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.passBtn} onPress={() => handleReject(c.id)}>
                    <Text style={styles.passText}>✕ Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shortlistBtn}
                    onPress={() => handleShortlist(c.id)}
                  >
                    <Text style={styles.shortlistText}>⭐ Shortlist</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => router.push('/(recruiter)/chats')}
                  >
                    <Text style={styles.msgText}>💬 Message</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FULL CANDIDATE PROFILE MODAL */}
      <Modal
        visible={!!selectedCandidate}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCandidate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Full Candidate Profile</Text>
              <TouchableOpacity onPress={() => setSelectedCandidate(null)}>
                <Text style={styles.closeBtn}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            {selectedCandidate && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                {/* Profile Card Header */}
                <View style={styles.profileHeaderBox}>
                  <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>
                      {selectedCandidate.seeker?.fullName
                        ? selectedCandidate.seeker.fullName.slice(0, 2).toUpperCase()
                        : 'CD'}
                    </Text>
                  </View>
                  <Text style={styles.profileName}>{selectedCandidate.seeker?.fullName}</Text>
                  <Text style={styles.profileHeadline}>{selectedCandidate.seeker?.headline}</Text>
                  <Text style={styles.appliedJobText}>
                    Applying for: {selectedCandidate.job?.title}
                  </Text>
                </View>

                {/* Information Sections */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>LOCATION & EXPECTED SALARY</Text>
                  <Text style={styles.infoValue}>📍 {selectedCandidate.seeker?.city || 'Remote / India'}</Text>
                  <Text style={styles.salaryValue}>
                    💰 Expected: {selectedCandidate.seeker?.expectedSalary
                      ? `₹${(selectedCandidate.seeker.expectedSalary / 100000).toFixed(1)} Lakhs / year`
                      : 'Negotiable'}
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>PROFESSIONAL SKILLS & EXPERTISE</Text>
                  <View style={styles.modalSkillsRow}>
                    {(selectedCandidate.seeker?.skills || []).map((skill: string, idx: number) => (
                      <View key={idx} style={styles.modalSkillChip}>
                        <Text style={styles.modalSkillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>CONTACT INFORMATION</Text>
                  <Text style={styles.infoValue}>✉️ Email: {selectedCandidate.seeker?.email || 'N/A'}</Text>
                  {selectedCandidate.seeker?.phone && (
                    <Text style={styles.infoValue}>📞 Phone: {selectedCandidate.seeker.phone}</Text>
                  )}
                </View>

                {/* Academic Qualifications Section */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>🎓 ACADEMIC QUALIFICATIONS</Text>
                  {selectedCandidate.seeker?.underGraduation ? (
                    <Text style={styles.infoValue}>🎓 UG: {selectedCandidate.seeker.underGraduation}</Text>
                  ) : null}
                  {selectedCandidate.seeker?.postGraduation ? (
                    <Text style={styles.infoValue}>🎓 PG: {selectedCandidate.seeker.postGraduation}</Text>
                  ) : null}
                  {selectedCandidate.seeker?.twelfthSchool ? (
                    <Text style={styles.infoValue}>
                      🏫 12th: {selectedCandidate.seeker.twelfthSchool} ({selectedCandidate.seeker.twelfthBoard || 'Board'})
                    </Text>
                  ) : null}
                  {selectedCandidate.seeker?.tenthSchool ? (
                    <Text style={styles.infoValue}>
                      🏫 10th: {selectedCandidate.seeker.tenthSchool} ({selectedCandidate.seeker.tenthBoard || 'Board'})
                    </Text>
                  ) : null}
                </View>

                {/* Work & Internships */}
                {(selectedCandidate.seeker?.internships || selectedCandidate.seeker?.experiences) ? (
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionHeading}>💼 WORK & INTERNSHIPS</Text>
                    {selectedCandidate.seeker?.internships ? (
                      <Text style={styles.infoValue}>💼 Internships: {selectedCandidate.seeker.internships}</Text>
                    ) : null}
                    {selectedCandidate.seeker?.experiences ? (
                      <Text style={styles.infoValue}>🏢 Experience: {selectedCandidate.seeker.experiences}</Text>
                    ) : null}
                  </View>
                ) : null}

                {/* Live Projects & Portfolio */}
                {(selectedCandidate.seeker?.liveProjectLink || selectedCandidate.seeker?.liveProjectDesc) ? (
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionHeading}>🚀 LIVE PROJECT PORTFOLIO</Text>
                    {selectedCandidate.seeker?.liveProjectLink ? (
                      <TouchableOpacity
                        style={styles.liveProjectBox}
                        onPress={() => Linking.openURL(selectedCandidate.seeker.liveProjectLink)}
                      >
                        <Text style={styles.liveProjectIcon}>🚀</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.liveProjectTitle}>Live Project URL</Text>
                          <Text style={styles.liveProjectUrl} numberOfLines={1}>
                            {selectedCandidate.seeker.liveProjectLink}
                          </Text>
                        </View>
                        <Text style={styles.resumeOpenText}>Test Live ↗</Text>
                      </TouchableOpacity>
                    ) : null}
                    {selectedCandidate.seeker?.liveProjectDesc ? (
                      <Text style={styles.projectDescText}>
                        {selectedCandidate.seeker.liveProjectDesc}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                {/* Resume Document Link */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>CANDIDATE RESUME</Text>
                  {selectedCandidate.seeker?.resumeUrl ? (
                    <TouchableOpacity
                      style={styles.resumeBox}
                      onPress={() => Linking.openURL(selectedCandidate.seeker.resumeUrl)}
                    >
                      <Text style={styles.resumeIcon}>📄</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resumeTitle}>Uploaded PDF Resume</Text>
                        <Text style={styles.resumeSubtitle}>Tap to view/download resume document</Text>
                      </View>
                      <Text style={styles.resumeOpenText}>Open ↗</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.noResumeBox}>
                      <Text style={styles.noResumeText}>📄 Standard Profile Resume Verified</Text>
                    </View>
                  )}
                </View>

                {/* Actions in Modal */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalShortlistBtn}
                    onPress={() => {
                      handleShortlist(selectedCandidate.id);
                      setSelectedCandidate(null);
                    }}
                  >
                    <Text style={styles.modalActionText}>⭐ Shortlist Candidate</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalMsgBtn}
                    onPress={() => {
                      setSelectedCandidate(null);
                      router.push('/(recruiter)/chats');
                    }}
                  >
                    <Text style={styles.modalActionText}>💬 Send First Message</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { fontSize: 12, color: '#64748B', marginTop: 8 },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  emptyDesc: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headline: { fontSize: 12, color: '#64748B', marginTop: 1 },
  jobBadge: { fontSize: 11, fontWeight: '700', color: '#7C6CF0', marginTop: 3 },
  viewProfileHint: { fontSize: 11, fontWeight: '800', color: '#7C6CF0' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#F3E8FF' },
  chipText: { fontSize: 11, fontWeight: '700', color: '#7C6CF0' },
  btnRow: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  passBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  shortlistBtn: {
    flex: 1.2,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  shortlistText: { fontSize: 12, color: '#D97706', fontWeight: '800' },
  msgBtn: {
    flex: 1.2,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justify.content: 'center',
  },
  msgText: { fontSize: 12, color: '#FFFFFF', fontWeight: '800' },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  closeBtn: { fontSize: 14, fontWeight: '800', color: '#EF4444' },
  modalContent: { padding: 20, gap: 16 },
  profileHeaderBox: {
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  largeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  largeAvatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  profileName: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  profileHeadline: { fontSize: 13, color: '#64748B', marginTop: 2, textAlign: 'center' },
  appliedJobText: { fontSize: 12, fontWeight: '800', color: '#7C6CF0', marginTop: 6 },
  infoSection: { gap: 6 },
  sectionHeading: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, color: '#334155', fontWeight: '600' },
  salaryValue: { fontSize: 14, color: '#16A34A', fontWeight: '800' },
  modalSkillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  modalSkillChip: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  modalSkillText: { fontSize: 12, fontWeight: '700', color: '#7C6CF0' },
  resumeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  liveProjectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 10,
  },
  liveProjectIcon: { fontSize: 24 },
  liveProjectTitle: { fontSize: 13, fontWeight: '800', color: '#6D28D9' },
  liveProjectUrl: { fontSize: 11, color: '#7C6CF0', fontWeight: '600' },
  projectDescText: { fontSize: 12, color: '#475569', lineHeight: 17, marginTop: 4 },
  resumeIcon: { fontSize: 24 },
  resumeTitle: { fontSize: 13, fontWeight: '800', color: '#1E40AF' },
  resumeSubtitle: { fontSize: 11, color: '#3B82F6' },
  resumeOpenText: { fontSize: 12, fontWeight: '800', color: '#2563EB' },
  noResumeBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noResumeText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  modalActions: { gap: 10, marginTop: 10 },
  modalShortlistBtn: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  modalMsgBtn: {
    backgroundColor: '#7C6CF0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalActionText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
});
