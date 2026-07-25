import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiFetch } from '../../../lib/api';

export default function MobileChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ interestId?: string }>();
  const interestId = params.interestId;

  const [loading, setLoading] = useState(true);
  const [canReply, setCanReply] = useState(false);
  const [jobTitle, setJobTitle] = useState('Job Match');
  const [companyName, setCompanyName] = useState('Company');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchChat = async () => {
    if (!interestId) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch(`/conversations/${interestId}`);
      setCanReply(data.canReply);
      setJobTitle(data.job?.title || 'Job Match');
      setCompanyName(data.job?.companyName || 'Company');
      setMessages(data.messages || []);
    } catch (err: any) {
      console.log('Error fetching chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    // Poll for new messages every 4 seconds when in active chat
    const interval = setInterval(fetchChat, 4000);
    return () => clearInterval(interval);
  }, [interestId]);

  const handleSend = async () => {
    if (!text.trim() || !interestId) return;

    if (!canReply) {
      Alert.alert(
        'Chat Locked 🔒',
        'In SwipeHire, only the recruiter can initiate the first message. Once the recruiter messages you, your chat input will unlock!'
      );
      return;
    }

    setSending(true);
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({ interestId, body: text.trim() }),
      });
      setText('');
      await fetchChat();
    } catch (err: any) {
      console.log('Failed to send message:', err);
      Alert.alert('Send Error', err.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{jobTitle}</Text>
          <Text style={styles.headerSubtitle}>{companyName}</Text>
        </View>
      </View>

      {/* Messages List */}
      <View style={styles.chatArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading conversation...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>🔒 Awaiting Recruiter's First Message</Text>
            <Text style={styles.emptySub}>
              You expressed interest in this job! Per First Message Rules, the recruiter will initiate the chat first. Once sent, you can reply here directly.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => {
              const isSeeker = item.senderRole === 'SEEKER';
              return (
                <View
                  style={[
                    styles.bubble,
                    isSeeker ? styles.seekerBubble : styles.recruiterBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isSeeker ? styles.seekerText : styles.recruiterText,
                    ]}
                  >
                    {item.body}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Input or Lock Box */}
      {!canReply ? (
        <View style={styles.lockBox}>
          <Text style={styles.lockTitle}>🔒 Chat Input Locked</Text>
          <Text style={styles.lockSub}>
            Recruiter must send the first message to unlock chat replies for this job match.
          </Text>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a response to recruiter..."
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={sending || !text.trim()}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backBtnText: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  chatArea: {
    flex: 1,
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
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
  seekerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  recruiterBubble: {
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
  seekerText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recruiterText: {
    color: '#0F172A',
  },
  lockBox: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  lockSub: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 4,
    lineHeight: 16,
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
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
