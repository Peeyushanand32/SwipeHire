import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveAuthSession } from '../lib/auth';
import { apiFetch } from '../lib/api';

export default function MobileSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const [role, setRole] = useState<'SEEKER' | 'RECRUITER'>(
    params.role === 'RECRUITER' ? 'RECRUITER' : 'SEEKER'
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.role === 'RECRUITER' || params.role === 'SEEKER') {
      setRole(params.role);
    }
  }, [params.role]);

  const handleSignup = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!fullName || !cleanEmail || !password) {
      Alert.alert('Missing Fields', 'Please fill in your name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email: cleanEmail,
          password,
          role,
        }),
      });

      await saveAuthSession(response.token, response.user);

      if (role === 'RECRUITER') {
        Alert.alert(
          'Account Created! Step 2/2',
          'Please complete your company details and GST for Admin KYC approval.'
        );
        router.replace('/(recruiter)/company-setup');
      } else {
        Alert.alert(
          'Account Created! Step 2/2',
          'Please complete your professional profile & skills to start swiping on jobs.'
        );
        router.replace('/(seeker)/profile-setup');
      }
    } catch (err: any) {
      const errorMessage = err.message || '';
      if (errorMessage.toLowerCase().includes('already exists')) {
        Alert.alert(
          'Account Already Exists',
          `An account with email "${cleanEmail}" is already registered. Would you like to Sign In instead?`,
          [
            { text: 'Use Different Email', style: 'cancel' },
            {
              text: 'Sign In Now',
              onPress: () => router.push({ pathname: '/login', params: { role, email: cleanEmail } }),
            },
          ]
        );
      } else {
        Alert.alert('Signup Error', errorMessage || 'Could not complete registration. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step 1 of 2: Basic account registration</Text>
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

        {/* Account Details */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder={role === 'SEEKER' ? 'John Doe' : 'HR Manager Name'}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address *</Text>
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
          <Text style={styles.label}>Password *</Text>
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
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              Create {role === 'SEEKER' ? 'Seeker' : 'Recruiter'} Account & Setup Profile →
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/login', params: { role } })}>
            <Text style={styles.linkText}>Sign In</Text>
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
  content: {
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  header: {
    marginBottom: 24,
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
    marginBottom: 20,
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
    marginBottom: 16,
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
    marginTop: 12,
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
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
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
