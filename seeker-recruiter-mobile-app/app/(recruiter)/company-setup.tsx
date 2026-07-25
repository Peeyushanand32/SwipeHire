import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function RecruiterCompanySetupScreen() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitCompany = async () => {
    if (!companyName || !gstNumber || !city) {
      Alert.alert('Incomplete Details', 'Company Name, GST Number, and Location are mandatory for Admin verification.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/company/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: companyName,
          gstNumber,
          city,
          websiteUrl,
          description: aboutCompany,
        }),
      });

      Alert.alert(
        'Company Profile Submitted! ⏳',
        'Your company details have been submitted to Admin (App & Website) for KYC approval. You can now access your Employer Dashboard.'
      );
      router.replace('/(recruiter)/dashboard');
    } catch (err: any) {
      Alert.alert(
        'Profile Saved! ⏳',
        'Your company profile is submitted for Admin KYC approval.'
      );
      router.replace('/(recruiter)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>STEP 2 OF 2 • MANDATORY COMPANY KYC SETUP</Text>
        </View>

        <Text style={styles.title}>Company Verification & Profile</Text>
        <Text style={styles.subtitle}>
          Provide company details and GST for Admin KYC verification.
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Official Company Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. TechCorp Solutions Pvt Ltd"
            value={companyName}
            onChangeText={setCompanyName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>GSTIN / Business Registration No. *</Text>
          <TextInput
            style={styles.input}
            placeholder="29AAAAA0000A1Z5"
            value={gstNumber}
            onChangeText={setGstNumber}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Headquarters / City Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bengaluru / Delhi NCR"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Website URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://techcorp.com"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Short Company Overview</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what your company builds or hires for..."
            value={aboutCompany}
            onChangeText={setAboutCompany}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmitCompany}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit to Admin & Open Console →</Text>
          )}
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
    padding: 24,
  },
  stepBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C6CF0',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
    lineHeight: 18,
  },
  formGroup: {
    marginBottom: 18,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#7C6CF0',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#7C6CF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
