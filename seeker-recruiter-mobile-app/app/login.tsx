import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveAuthSession } from '../lib/auth';
import { apiFetch } from '../lib/api';

export default function MobileLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  
  const [role, setRole] = useState<'SEEKER' | 'RECRUITER'>(
    params.role === 'RECRUITER' ? 'RECRUITER' : 'SEEKER'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.role === 'RECRUITER' || params.role === 'SEEKER') {
      setRole(params.role);
    }
  }, [params.role]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });

      await saveAuthSession(response.token, response.user);

      if (response.user.role === 'RECRUITER') {
        router.replace('/(recruiter)/dashboard');
      } else {
        router.replace('/(seeker)/discover');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your SwipeHire account</Text>
        </View>

        {/* Role Toggle Bar */}
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'SEEKER' && styles.activeTabSeeker]}
            onPress={() => setRole('SEEKER')}
          >
            <Text style={[styles.roleTabText, role === 'SEEKER' && styles.activeTabText]}>
              👤 Job Seeker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'RECRUITER' && styles.activeTabRecruiter]}
            onPress={() => setRole('RECRUITER')}
          >
            <Text style={[styles.roleTabText, role === 'RECRUITER' && styles.activeTabText]}>
              💼 Recruiter
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder={role === 'SEEKER' ? 'seeker@example.com' : 'recruiter@company.com'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, role === 'RECRUITER' ? styles.btnRecruiter : styles.btnSeeker]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              Sign In as {role === 'SEEKER' ? 'Job Seeker' : 'Recruiter'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/signup', params: { role } })}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabSeeker: {
    backgroundColor: '#4F46E5',
  },
  activeTabRecruiter: {
    backgroundColor: '#7C6CF0',
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSeeker: {
    backgroundColor: '#4F46E5',
  },
  btnRecruiter: {
    backgroundColor: '#7C6CF0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
});
