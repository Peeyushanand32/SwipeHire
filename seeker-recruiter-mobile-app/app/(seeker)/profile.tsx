import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function MobileProfileScreen() {
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [headline, setHeadline] = useState('Full Stack React Developer');
  const [skills, setSkills] = useState('React, TypeScript, Node.js');
  const [expectedSalary, setExpectedSalary] = useState('1800000');
  const [city, setCity] = useState('Bangalore');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile Settings</Text>
        <Text style={styles.subtitle}>Manage your seeker bio and matching parameters</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Headline</Text>
          <TextInput style={styles.input} value={headline} onChangeText={setHeadline} />

          <Text style={styles.label}>Skills (Comma Separated)</Text>
          <TextInput style={styles.input} value={skills} onChangeText={setSkills} />

          <Text style={styles.label}>Expected Salary (₹ / yr)</Text>
          <TextInput style={styles.input} value={expectedSalary} onChangeText={setExpectedSalary} keyboardType="numeric" />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          <TouchableOpacity style={styles.saveButton} onPress={() => alert('Profile Updated!')}>
            <Text style={styles.saveText}>Save Profile</Text>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E8E5FF', gap: 12 },
  label: { fontSize: 11, fontWeight: '700', color: '#464555' },
  input: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#C7C4D8', paddingHorizontal: 12, fontSize: 13 },
  saveButton: { height: 48, borderRadius: 24, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  saveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
