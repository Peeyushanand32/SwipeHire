import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveAuthSession } from '../lib/auth';

const API_BASE = 'http://10.14.254.189:3000';

export default function SeekerSignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Full Name, Email and Password are required');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const skillsArray = skills ? skills.split(',').map((s) => s.trim()) : [];
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role: 'SEEKER',
          headline,
          city,
          skills: skillsArray,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      await saveAuthSession(data.token, data.user);
      Alert.alert('Account Created!', 'Your Job Seeker profile has been successfully registered.');
      router.replace('/discover');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Seeker Account</Text>
          <Text style={styles.subtitle}>Register to start swiping verified job openings</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>FULL NAME *</Text>
            <TextInput style={styles.input} placeholder="John Doe" value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL ADDRESS *</Text>
            <TextInput style={styles.input} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput style={styles.input} placeholder="+91 9876543210" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>PASSWORD *</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>PROFESSIONAL HEADLINE</Text>
            <TextInput style={styles.input} placeholder="e.g. Senior Frontend Developer • 4 Yrs Exp" value={headline} onChangeText={setHeadline} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>CITY / LOCATION</Text>
            <TextInput style={styles.input} placeholder="e.g. Bengaluru, Remote" value={city} onChangeText={setCity} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>SKILLS (COMMA SEPARATED)</Text>
            <TextInput style={styles.input} placeholder="e.g. React, Next.js, Node.js" value={skills} onChangeText={setSkills} />
          </View>

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signupBtnText}>Create Seeker Profile →</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBack} onPress={() => router.push('/login')}>
            <Text style={styles.loginBackText}>Already registered? Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 16 },
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B' },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  form: { gap: 12 },
  field: { gap: 4 },
  label: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A' },
  signupBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  signupBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  loginBack: { alignItems: 'center', marginTop: 8 },
  loginBackText: { color: '#4F46E5', fontWeight: '700', fontSize: 13 },
});
