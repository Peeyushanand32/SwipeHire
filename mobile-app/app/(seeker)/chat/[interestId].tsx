import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';

const API_BASE = 'http://10.0.2.2:3000';

export default function MobileChatScreen({ route }: any) {
  const interestId = route?.params?.interestId || 'demo';

  const [loading, setLoading] = useState(true);
  const [canReply, setCanReply] = useState(false);
  const [jobTitle, setJobTitle] = useState('Senior Engineer');
  const [companyName, setCompanyName] = useState('TechCorp');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/conversations/${interestId}`);
      if (res.ok) {
        const data = await res.json();
        setCanReply(data.canReply);
        setJobTitle(data.job?.title || 'Job Match');
        setCompanyName(data.job?.companyName || 'Company');
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [interestId]);

  const handleSend = async () => {
    if (!text.trim() || !canReply) return;
    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interestId, body: text }),
      });
      setText('');
      fetchChat();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{jobTitle}</Text>
        <Text style={styles.headerSubtitle}>{companyName}</Text>
      </View>

      {/* Messages */}
      <View style={styles.chatArea}>
        {loading ? (
          <ActivityIndicator color="#4F46E5" style={{ marginTop: 20 }} />
        ) : messages.length === 0 ? (
          <Text style={styles.emptyMessages}>No messages yet. Waiting for recruiter to initiate chat.</Text>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSeeker = item.senderRole === 'SEEKER';
              return (
                <View style={[styles.bubble, isSeeker ? styles.seekerBubble : styles.recruiterBubble]}>
                  <Text style={[styles.bubbleText, isSeeker ? styles.seekerText : styles.recruiterText]}>
                    {item.body}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Locked Input Banner / Input */}
      {!canReply ? (
        <View style={styles.lockBox}>
          <Text style={styles.lockTitle}>🔒 Input Locked</Text>
          <Text style={styles.lockSub}>The recruiter must send the first message to unlock chat replies.</Text>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF8FF',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFECFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#464555',
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  emptyMessages: {
    fontSize: 12,
    color: '#777587',
    textAlign: 'center',
    marginTop: 40,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  seekerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 2,
  },
  recruiterBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E8E5FF',
  },
  bubbleText: {
    fontSize: 13,
  },
  seekerText: {
    color: '#FFFFFF',
  },
  recruiterText: {
    color: '#1A1A2E',
  },
  lockBox: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#EFECFF',
    borderWidth: 1,
    borderColor: '#C3C0FF',
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3525CD',
  },
  lockSub: {
    fontSize: 11,
    color: '#464555',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFECFF',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C7C4D8',
    paddingHorizontal: 16,
    fontSize: 13,
  },
  sendButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
