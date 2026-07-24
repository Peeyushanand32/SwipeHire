import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveAuthSession } from '../lib/auth';

const API_BASE = 'http://10.14.254.189:3000';

export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter Admin Email and Master Key Password');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Admin Authentication Failed.');
      }

      if (data.user.role !== 'ADMIN') {
        Alert.alert('Access Denied', 'Only Platform Master Admins can access this console.');
        setLoading(false);
        return;
      }

      await saveAuthSession(data.token, data.user);
      Alert.alert('Admin Authenticated!', `Master session granted for ${data.user.email}`);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PLATFORM MASTER CONSOLE</Text>
          </View>
          <Text style={styles.title}>Admin Gateway 🛡️</Text>
          <Text style={styles.subtitle}>Enter master administrator credentials to access platform controls.</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>ADMINISTRATOR EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="admin@swipehire.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>MASTER SECRET KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Unlock Admin Console →</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, justifyContent: 'center', flex: 1, gap: 20 },
  header: { gap: 6 },
  badge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999, alignSelf: 'flex-start' },
  badgeText: { color: '#FF6B5C', fontSize: 10, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  form: { gap: 14 },
  field: { gap: 6 },
  label: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0F172A' },
  loginBtn: { backgroundColor: '#FF6B5C', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
