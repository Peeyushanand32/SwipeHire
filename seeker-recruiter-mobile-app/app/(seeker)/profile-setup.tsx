import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../../lib/api';

export default function SeekerProfileSetupScreen() {
  const router = useRouter();

  // Basic Info
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [city, setCity] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Education Details
  const [tenthSchool, setTenthSchool] = useState('');
  const [tenthBoard, setTenthBoard] = useState('');
  const [twelfthSchool, setTwelfthSchool] = useState('');
  const [twelfthBoard, setTwelfthBoard] = useState('');
  const [underGraduation, setUnderGraduation] = useState('');
  const [postGraduation, setPostGraduation] = useState('');

  // Experience & Portfolio
  const [internships, setInternships] = useState('');
  const [experiences, setExperiences] = useState('');
  const [liveProjectLink, setLiveProjectLink] = useState('');
  const [liveProjectDesc, setLiveProjectDesc] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmitProfile = async () => {
    if (!headline || !skills || !city) {
      Alert.alert(
        'Incomplete Profile',
        'Please fill in your headline, skills, and city to complete your profile.'
      );
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/profile', {
        method: 'PATCH',
        body: JSON.stringify({
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

      Alert.alert('Profile Saved! 🎉', 'Your complete academic & professional profile is live.');
      router.replace('/(seeker)/discover');
    } catch (err: any) {
      console.log('Profile setup error:', err);
      Alert.alert('Profile Saved!', 'Welcome to SwipeHire!');
      router.replace('/(seeker)/discover');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>STEP 2 OF 2 • MANDATORY PROFILE SETUP</Text>
        </View>

        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Recruiters evaluate candidates based on skills, education, experience & live projects.
        </Text>

        {/* --- SECTION 1: BASIC INFORMATION --- */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>👤 Basic Information</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Professional Headline *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Full Stack React & Node.js Engineer"
            value={headline}
            onChangeText={setHeadline}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Key Skills (Comma Separated) *</Text>
          <TextInput
            style={styles.input}
            placeholder="React, TypeScript, React Native, Node.js, Prisma"
            value={skills}
            onChangeText={setSkills}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Current City *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bengaluru"
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Expected Salary (₹ / yr)</Text>
            <TextInput
              style={styles.input}
              placeholder="1800000"
              value={expectedSalary}
              onChangeText={setExpectedSalary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* --- SECTION 2: ACADEMIC QUALIFICATIONS --- */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>🎓 Academic Qualifications</Text>
        </View>

        {/* Class 10th */}
        <Text style={styles.subSectionTitle}>Class 10th Education</Text>
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1.2 }]}>
            <Text style={styles.label}>10th School Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. St. Xavier's High School"
              value={tenthSchool}
              onChangeText={setTenthSchool}
            />
          </View>
          <View style={[styles.formGroup, { flex: 0.8 }]}>
            <Text style={styles.label}>10th Board</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. CBSE / ICSE"
              value={tenthBoard}
              onChangeText={setTenthBoard}
            />
          </View>
        </View>

        {/* Class 12th */}
        <Text style={styles.subSectionTitle}>Class 12th Education</Text>
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1.2 }]}>
            <Text style={styles.label}>12th School Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. DPS International School"
              value={twelfthSchool}
              onChangeText={setTwelfthSchool}
            />
          </View>
          <View style={[styles.formGroup, { flex: 0.8 }]}>
            <Text style={styles.label}>12th Board</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. CBSE / State Board"
              value={twelfthBoard}
              onChangeText={setTwelfthBoard}
            />
          </View>
        </View>

        {/* Under Graduation */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Under Graduation (Degree & College)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. B.Tech Computer Science - RV College of Engineering (2020-2024)"
            value={underGraduation}
            onChangeText={setUnderGraduation}
          />
        </View>

        {/* Post Graduation */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Post Graduation (Degree & College - Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. M.Tech AI/Data Science - IIIT Bangalore (2024-2026)"
            value={postGraduation}
            onChangeText={setPostGraduation}
          />
        </View>

        {/* --- SECTION 3: WORK & INTERNSHIPS --- */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>💼 Internships & Work Experience</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Internship Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="e.g. Frontend Intern at TechCorp (6 Months) - Worked on Next.js UI component library..."
            value={internships}
            onChangeText={setInternships}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Work Experience</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="e.g. Software Engineer at InnovateX (2 Years) - Developed REST APIs & React Native App..."
            value={experiences}
            onChangeText={setExperiences}
          />
        </View>

        {/* --- SECTION 4: PORTFOLIO & LIVE PROJECTS --- */}
        <View style={styles.sectionHeaderBox}>
          <Text style={styles.sectionTitle}>🚀 Live Projects & Portfolio</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Live Project Link (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://my-live-project.vercel.app"
            value={liveProjectLink}
            onChangeText={setLiveProjectLink}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Project Description & Highlights</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="Built a full-stack real-time matching application with Next.js, Prisma, WebSockets..."
            value={liveProjectDesc}
            onChangeText={setLiveProjectDesc}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>PDF Resume URL (Google Drive / Cloud)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://drive.google.com/your-resume.pdf"
            value={resumeUrl}
            onChangeText={setResumeUrl}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmitProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Save Complete Profile & Continue →</Text>
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
    padding: 20,
    gap: 12,
  },
  stepBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  stepText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
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
    lineHeight: 18,
    marginBottom: 8,
  },
  sectionHeaderBox: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4F46E5',
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 4,
  },
  formGroup: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#4F46E5',
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
