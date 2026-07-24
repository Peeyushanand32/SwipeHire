import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function MobilePostJobScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [city, setCity] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Post a Job</Text>
        <Text style={styles.subtitle}>Mobile job creator</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Senior Engineer" />

          <Text style={styles.label}>Description *</Text>
          <TextInput style={[styles.input, { height: 80 }]} multiline value={description} onChangeText={setDescription} placeholder="Job description..." />

          <Text style={styles.label}>Skills (Comma Separated)</Text>
          <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="React, Node.js" />

          <Text style={styles.label}>Min Salary (₹)</Text>
          <TextInput style={styles.input} value={salaryMin} onChangeText={setSalaryMin} keyboardType="numeric" />

          <Text style={styles.label}>Max Salary (₹)</Text>
          <TextInput style={styles.input} value={salaryMax} onChangeText={setSalaryMax} keyboardType="numeric" />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Bangalore" />

          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              alert('Job Posted!');
              navigation?.goBack?.();
            }}
          >
            <Text style={styles.postText}>Publish Job</Text>
          </TouchableOpacity>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E8E5FF', gap: 10 },
  label: { fontSize: 11, fontWeight: '700', color: '#464555' },
  input: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#C7C4D8', paddingHorizontal: 12, fontSize: 13 },
  postButton: { height: 48, borderRadius: 24, backgroundColor: '#4F46E5', alignItems: 'center', justify: 'center', marginTop: 10 },
  postText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
