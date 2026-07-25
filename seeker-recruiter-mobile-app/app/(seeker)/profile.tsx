import React, { useState, useEffect } from 'react';
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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { clearAuthSession } from '../../lib/auth';
import { apiFetch } from '../../lib/api';

export default function MobileProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [city, setCity] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Education State
  const [tenthSchool, setTenthSchool] = useState('');
  const [tenthBoard, setTenthBoard] = useState('');
  const [twelfthSchool, setTwelfthSchool] = useState('');
  const [twelfthBoard, setTwelfthBoard] = useState('');
  const [underGraduation, setUnderGraduation] = useState('');
  const [postGraduation, setPostGraduation] = useState('');

  // Experience & Project State
  const [internships, setInternships] = useState('');
  const [experiences, setExperiences] = useState('');
  const [liveProjectLink, setLiveProjectLink] = useState('');
  const [liveProjectDesc, setLiveProjectDesc] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await apiFetch('/profile');
      const p = data.user?.seekerProfile;
      if (p) {
        setFullName(p.fullName || '');
        setHeadline(p.headline || '');
        setSkills(Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || '');
        setExpectedSalary(p.expectedSalary ? String(p.expectedSalary) : '');
        setCity(p.city || '');
        setResumeUrl(p.resumeUrl || '');

        setTenthSchool(p.tenthSchool || '');
        setTenthBoard(p.tenthBoard || '');
        setTwelfthSchool(p.twelfthSchool || '');
        setTwelfthBoard(p.twelfthBoard || '');
        setUnderGraduation(p.underGraduation || '');
        setPostGraduation(p.postGraduation || '');

        setInternships(p.internships || '');
        setExperiences(p.experiences || '');
        setLiveProjectLink(p.liveProjectLink || '');
        setLiveProjectDesc(p.liveProjectDesc || '');
      }
    } catch (err: any) {
      console.log('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiFetch('/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: fullName.trim(),
          headline: headline.trim(),
          skills: skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          expectedSalary: expectedSalary ? parseInt(expectedSalary, 10) : null,
          city: city.trim(),
          resumeUrl: resumeUrl.trim(),
          tenthSchool: tenthSchool.trim(),
          tenthBoard: tenthBoard.trim(),
          twelfthSchool: twelfthSchool.trim(),
          twelfthBoard: twelfthBoard.trim(),
          underGraduation: underGraduation.trim(),
          postGraduation: postGraduation.trim(),
          internships: internships.trim(),
          experiences: experiences.trim(),
          liveProjectLink: liveProjectLink.trim(),
          liveProjectDesc: liveProjectDesc.trim(),
        }),
      });

      Alert.alert('Profile Saved! 🎉', 'Your complete academic & professional profile is updated.');
    } catch (err: any) {
      Alert.alert('Save Error', err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>My Seeker Profile</Text>
          <Text style={styles.subtitle}>
            Manage your academic credentials, experiences, and live portfolio
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading profile details...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {/* Section 1: Basic Profile */}
            <Text style={styles.sectionHeading}>👤 PERSONAL INFORMATION</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Professional Headline</Text>
              <TextInput style={styles.input} value={headline} onChangeText={setHeadline} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Skills (Comma Separated)</Text>
              <TextInput style={styles.input} value={skills} onChangeText={setSkills} />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.input} value={city} onChangeText={setCity} />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Expected Salary (₹ / yr)</Text>
                <TextInput
                  style={styles.input}
                  value={expectedSalary}
                  onChangeText={setExpectedSalary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Section 2: Education */}
            <Text style={styles.sectionHeading}>🎓 ACADEMIC QUALIFICATIONS</Text>

            <Text style={styles.subSectionTitle}>Class 10th Details</Text>
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1.2 }]}>
                <Text style={styles.label}>10th School Name</Text>
                <TextInput
                  style={styles.input}
                  value={tenthSchool}
                  onChangeText={setTenthSchool}
                  placeholder="School Name"
                />
              </View>
              <View style={[styles.formGroup, { flex: 0.8 }]}>
                <Text style={styles.label}>10th Board</Text>
                <TextInput
                  style={styles.input}
                  value={tenthBoard}
                  onChangeText={setTenthBoard}
                  placeholder="CBSE / ICSE"
                />
              </View>
            </View>

            <Text style={styles.subSectionTitle}>Class 12th Details</Text>
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1.2 }]}>
                <Text style={styles.label}>12th School Name</Text>
                <TextInput
                  style={styles.input}
                  value={twelfthSchool}
                  onChangeText={setTwelfthSchool}
                  placeholder="School Name"
                />
              </View>
              <View style={[styles.formGroup, { flex: 0.8 }]}>
                <Text style={styles.label}>12th Board</Text>
                <TextInput
                  style={styles.input}
                  value={twelfthBoard}
                  onChangeText={setTwelfthBoard}
                  placeholder="CBSE / State"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Under Graduation (Degree & College)</Text>
              <TextInput
                style={styles.input}
                value={underGraduation}
                onChangeText={setUnderGraduation}
                placeholder="B.Tech Computer Science - College Name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Post Graduation (Degree & College)</Text>
              <TextInput
                style={styles.input}
                value={postGraduation}
                onChangeText={setPostGraduation}
                placeholder="M.Tech - College Name (Optional)"
              />
            </View>

            {/* Section 3: Work & Internships */}
            <Text style={styles.sectionHeading}>💼 WORK & INTERNSHIPS</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Internship Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                value={internships}
                onChangeText={setInternships}
                placeholder="Company, Role, Duration, Accomplishments..."
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                value={experiences}
                onChangeText={setExperiences}
                placeholder="Full-time work history & key contributions..."
              />
            </View>

            {/* Section 4: Live Project & Resume */}
            <Text style={styles.sectionHeading}>🚀 LIVE PROJECT & RESUME</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Live Project Link (URL)</Text>
              <TextInput
                style={styles.input}
                value={liveProjectLink}
                onChangeText={setLiveProjectLink}
                placeholder="https://myproject.com"
                autoCapitalize="none"
              />
            </View>

            {liveProjectLink ? (
              <TouchableOpacity
                style={styles.linkPreviewBox}
                onPress={() => Linking.openURL(liveProjectLink)}
              >
                <Text style={styles.linkPreviewText}>🔗 Test Open Live Project: {liveProjectLink} ↗</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                value={liveProjectDesc}
                onChangeText={setLiveProjectDesc}
                placeholder="Key features and technology stack used..."
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>PDF Resume Document Link</Text>
              <TextInput
                style={styles.input}
                value={resumeUrl}
                onChangeText={setResumeUrl}
                placeholder="https://drive.google.com/resume.pdf"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>Save Profile Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                await clearAuthSession();
                Alert.alert('Logged Out', 'You have been logged out.');
                router.replace('/login');
              }}
            >
              <Text style={styles.logoutText}>Log Out from Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  center: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 12, color: '#64748B', marginTop: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  formGroup: { gap: 4 },
  row: { flexDirection: 'row', gap: 10 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  linkPreviewBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  linkPreviewText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  saveButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  logoutBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
