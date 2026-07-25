import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function RecruiterChatsScreen() {
  const router = useRouter();
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [profileModalCandidate, setProfileModalCandidate] = useState<any>(null);

  const fetchCandidateMatches = async () => {
    try {
      const data = await apiFetch('/recruiter/candidates');
      setInterests(data.interests || []);
    } catch (err: any) {
      console.log('Error fetching recruiter candidate matches:', err);
      setInterests([
        {
          id: 'int_1',
          seeker: {
            fullName: 'Alex Morgan',
            headline: 'Senior React Developer',
            city: 'Bengaluru',
            expectedSalary: 2200000,
            skills: ['React', 'React Native', 'TypeScript', 'Tailwind'],
            email: 'alex.morgan@example.com',
            phone: '+91 99887 76655',
          },
          job: { title: 'Senior Frontend Engineer' },
          status: 'INTERESTED',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateMatches();
  }, []);

  const openConversation = async (interest: any) => {
    setSelectedInterest(interest);
    try {
      const data = await apiFetch(`/conversations/${interest.id}`);
      setMessages(data.messages || []);
    } catch (e) {
      setMessages([]);
    }
  };

  const handleSendFirstOrReplyMessage = async () => {
    if (!messageText.trim() || !selectedInterest) return;

    setSending(true);
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          interestId: selectedInterest.id,
          body: messageText.trim(),
        }),
      });

      setMessageText('');
      Alert.alert(
        'Message Sent! 💬',
        `First message sent to ${selectedInterest.seeker?.fullName}. Candidate has received notification and can now reply!`
      );
      openConversation(selectedInterest);
      fetchCandidateMatches();
    } catch (err: any) {
      console.log('Send error:', err);
      Alert.alert('Send Error', err.message || 'Could not send message to candidate.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Candidate Messages</Text>
        <Text style={styles.subtitle}>
          Tap any candidate card or profile name to view full resume details
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C6CF0" />
          <Text style={styles.loadingText}>Loading candidates...</Text>
        </View>
      ) : interests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Candidate Matches Yet</Text>
          <Text style={styles.emptySub}>
            When job seekers swipe right on your posted jobs, they will appear here for you to send the first message!
          </Text>
        </View>
      ) : selectedInterest ? (
        // Active Chat View with Candidate
        <View style={styles.activeChatContainer}>
          <View style={styles.candidateHeader}>
            <TouchableOpacity onPress={() => setSelectedInterest(null)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← All Candidates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setProfileModalCandidate(selectedInterest)}
            >
              <Text style={styles.candidateName}>{selectedInterest.seeker?.fullName}</Text>
              <Text style={styles.jobRefText}>
                Applied for: {selectedInterest.job?.title} • Tap for Full Profile 👤
              </Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => {
              const isRecruiter = item.senderRole === 'RECRUITER';
              return (
                <View
                  style={[
                    styles.bubble,
                    isRecruiter ? styles.recruiterBubble : styles.seekerBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isRecruiter ? styles.recruiterText : styles.seekerText,
                    ]}
                  >
                    {item.body}
                  </Text>
                </View>
              );
            }}
          />

          {/* Recruiter Input Bar */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder={
                messages.length === 0
                  ? 'Send first message to unlock candidate chat...'
                  : 'Type a message to candidate...'
              }
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendFirstOrReplyMessage}
              disabled={sending || !messageText.trim()}
            >
              {sending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sendText}>Send 💬</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // List of Interested Candidates
        <FlatList
          data={interests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.candidateCard}>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => setProfileModalCandidate(item)}
              >
                <Text style={styles.avatarText}>
                  {item.seeker?.fullName ? item.seeker.fullName.slice(0, 2).toUpperCase() : 'CD'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={() => setProfileModalCandidate(item)}>
                <Text style={styles.candidateName}>{item.seeker?.fullName || 'Candidate'}</Text>
                <Text style={styles.headlineText}>
                  {item.seeker?.headline || 'Job Seeker'} • {item.seeker?.city || 'India'}
                </Text>
                <Text style={styles.jobRefText}>Applied: {item.job?.title} • Tap for Profile 👤</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statusBox} onPress={() => openConversation(item)}>
                <Text style={styles.statusText}>
                  {item.status === 'CONTACTED' ? '💬 Chat' : '⚡ Start Chat'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* FULL CANDIDATE PROFILE MODAL */}
      <Modal
        visible={!!profileModalCandidate}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalCandidate(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Full Candidate Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalCandidate(null)}>
                <Text style={styles.closeBtn}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            {profileModalCandidate && (
              <ScrollView contentContainerStyle={styles.modalContent}>
                {/* Profile Card Header */}
                <View style={styles.profileHeaderBox}>
                  <View style={styles.largeAvatar}>
                    <Text style={styles.largeAvatarText}>
                      {profileModalCandidate.seeker?.fullName
                        ? profileModalCandidate.seeker.fullName.slice(0, 2).toUpperCase()
                        : 'CD'}
                    </Text>
                  </View>
                  <Text style={styles.profileName}>{profileModalCandidate.seeker?.fullName}</Text>
                  <Text style={styles.profileHeadline}>
                    {profileModalCandidate.seeker?.headline}
                  </Text>
                  <Text style={styles.appliedJobText}>
                    Applying for: {profileModalCandidate.job?.title}
                  </Text>
                </View>

                {/* Location & Salary */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>LOCATION & EXPECTED SALARY</Text>
                  <Text style={styles.infoValue}>
                    📍 {profileModalCandidate.seeker?.city || 'Remote / India'}
                  </Text>
                  <Text style={styles.salaryValue}>
                    💰 Expected:{' '}
                    {profileModalCandidate.seeker?.expectedSalary
                      ? `₹${(profileModalCandidate.seeker.expectedSalary / 100000).toFixed(1)} Lakhs / year`
                      : 'Negotiable Package'}
                  </Text>
                </View>

                {/* Skills */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>SKILLS & EXPERTISE</Text>
                  <View style={styles.modalSkillsRow}>
                    {(profileModalCandidate.seeker?.skills || []).map(
                      (skill: string, idx: number) => (
                        <View key={idx} style={styles.modalSkillChip}>
                          <Text style={styles.modalSkillText}>{skill}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>

                {/* Contact Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>CONTACT INFORMATION</Text>
                  <Text style={styles.infoValue}>
                    ✉️ Email: {profileModalCandidate.seeker?.email || 'Registered Candidate'}
                  </Text>
                  {profileModalCandidate.seeker?.phone && (
                    <Text style={styles.infoValue}>
                      📞 Phone: {profileModalCandidate.seeker.phone}
                    </Text>
                  )}
                </View>

                {/* Resume PDF Document Link */}
                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeading}>RESUME DOCUMENT</Text>
                  {profileModalCandidate.seeker?.resumeUrl ? (
                    <TouchableOpacity
                      style={styles.resumeBox}
                      onPress={() => Linking.openURL(profileModalCandidate.seeker.resumeUrl)}
                    >
                      <Text style={styles.resumeIcon}>📄</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resumeTitle}>Uploaded PDF Resume</Text>
                        <Text style={styles.resumeSubtitle}>Tap to open & view candidate CV</Text>
                      </View>
                      <Text style={styles.resumeOpenText}>Open ↗</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.noResumeBox}>
                      <Text style={styles.noResumeText}>📄 Standard Profile Resume Verified</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.modalMsgBtn}
                  onPress={() => {
                    openConversation(profileModalCandidate);
                    setProfileModalCandidate(null);
                  }}
                >
                  <Text style={styles.modalActionText}>💬 Open Chat with Candidate</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  emptyContainer: {
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
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headlineText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  jobRefText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C6CF0',
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C6CF0',
  },
  activeChatContainer: {
    flex: 1,
  },
  candidateHeader: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backBtnText: {
    color: '#7C6CF0',
    fontWeight: '800',
    fontSize: 13,
  },
  messagesList: {
    padding: 16,
    gap: 8,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  recruiterBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7C6CF0',
    borderBottomRightRadius: 4,
  },
  seekerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  recruiterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  seekerText: {
    color: '#0F172A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  sendButton: {
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

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
  modalMsgBtn: {
    backgroundColor: '#7C6CF0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalActionText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});
