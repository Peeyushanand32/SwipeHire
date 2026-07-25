import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function MobilePostJobScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Fields', 'Please enter a Job Title and Position Description.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        skills: skillsArray,
        salaryMin: salaryMin ? parseInt(salaryMin.replace(/,/g, ''), 10) : null,
        salaryMax: salaryMax ? parseInt(salaryMax.replace(/,/g, ''), 10) : null,
        city: city.trim() || 'Remote',
      };

      await apiFetch('/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      Alert.alert(
        'Job Published Live! 🎉',
        'Your job opening is now active and live on all Job Seekers\' swipe card decks.',
        [
          {
            text: 'View My Jobs',
            onPress: () => router.replace('/(recruiter)/my-jobs'),
          },
        ]
      );
    } catch (err: any) {
      console.log('Error publishing job:', err);
      Alert.alert('Posting Failed', err.message || 'Could not publish job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Post a New Job</Text>
          <Text style={styles.subtitle}>
            Publish position opening live to job seeker card deck
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Senior Frontend Developer"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City / Location</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Bengaluru / Remote"
            />
          </View>

          <View style={styles.salaryRow}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Min Salary (₹ / yr)</Text>
              <TextInput
                style={styles.input}
                value={salaryMin}
                onChangeText={setSalaryMin}
                placeholder="1200000"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Max Salary (₹ / yr)</Text>
              <TextInput
                style={styles.input}
                value={salaryMax}
                onChangeText={setSalaryMax}
                placeholder="2000000"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Required Skills (Comma separated)</Text>
            <TextInput
              style={styles.input}
              value={skills}
              onChangeText={setSkills}
              placeholder="React, TypeScript, Node.js"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Job Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe position responsibilities, requirements, and perks..."
            />
          </View>

          <TouchableOpacity
            style={styles.postButton}
            onPress={handlePublish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.postText}>🚀 Publish Job Live</Text>
            )}
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
  scroll: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  salaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#7C6CF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  postText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
