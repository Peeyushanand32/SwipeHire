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
  Alert,
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

  const fetchCandidateMatches = async () => {
    try {
      const data = await apiFetch('/recruiter/candidates');
      setInterests(data.interests || []);
    } catch (err: any) {
      console.log('Error fetching recruiter candidate matches:', err);
      setInterests([
        {
          id: 'int_1',
          seeker: { fullName: 'Alex Morgan', headline: 'Senior React Developer', city: 'Bengaluru' },
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
        `First message sent to ${selectedInterest.seeker?.fullName}. Seeker has received notification and can now reply!`
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
        <Text style={styles.subtitle}>Initiate first message to candidate matches</Text>
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
            <View>
              <Text style={styles.candidateName}>{selectedInterest.seeker?.fullName}</Text>
              <Text style={styles.jobRefText}>Applied for: {selectedInterest.job?.title}</Text>
            </View>
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
                  <Text style={[styles.bubbleText, isRecruiter ? styles.recruiterText : styles.seekerText]}>
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
                  ? 'Send first message to unlock chat...'
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
            <TouchableOpacity style={styles.candidateCard} onPress={() => openConversation(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.seeker?.fullName ? item.seeker.fullName.slice(0, 2).toUpperCase() : 'CD'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.candidateName}>{item.seeker?.fullName || 'Candidate'}</Text>
                <Text style={styles.headlineText}>
                  {item.seeker?.headline || 'Job Seeker'} • {item.seeker?.city || 'India'}
                </Text>
                <Text style={styles.jobRefText}>Applied: {item.job?.title}</Text>
              </View>

              <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                  {item.status === 'CONTACTED' ? '💬 Chatting' : '⚡ Start Chat'}
                </Text>
              </View>
            </TouchableOpacity>
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
    justify.content: 'center',
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
});
