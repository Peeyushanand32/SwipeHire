import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';

export default function RecruiterPostJobScreen() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Missing Fields', 'Please enter Job Title and Description.');
      return;
    }
    Alert.alert('Job Posted!', `Successfully published ${title} to SwipeHire job feed.`);
    setTitle('');
    setCity('');
    setSalaryMin('');
    setSalaryMax('');
    setSkills('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Create New Job Opening</Text>
        <Text style={styles.headerSubtitle}>Post your requirement to thousands of active candidates</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>JOB TITLE *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Senior React Developer"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>LOCATION / CITY</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bengaluru, Remote, Delhi"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>MIN SALARY (₹/YR)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1500000"
              keyboardType="numeric"
              value={salaryMin}
              onChangeText={setSalaryMin}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>MAX SALARY (₹/YR)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2500000"
              keyboardType="numeric"
              value={salaryMax}
              onChangeText={setSalaryMax}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>REQUIRED SKILLS (COMMA SEPARATED)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. React, Node.js, TypeScript"
            value={skills}
            onChangeText={setSkills}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>JOB DESCRIPTION *</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Describe key responsibilities and expectations..."
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity style={styles.publishBtn} onPress={handleSubmit}>
          <Text style={styles.publishText}>🚀 Publish Job Card to Feed</Text>
        </TouchableOpacity>
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
    padding: 20,
    gap: 16,
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
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  publishBtn: {
    backgroundColor: '#7C6CF0',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
