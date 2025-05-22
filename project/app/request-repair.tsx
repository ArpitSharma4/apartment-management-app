import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

const categories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Appliance',
  'Other',
];

export default function RequestRepairPage() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.back();
      }, 1200);
    }, 900);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
        <View style={styles.content}>
          <Text style={[styles.title, darkMode && styles.titleDark]}>Request Submitted!</Text>
          <Text style={[styles.confirmText, darkMode && styles.confirmTextDark]}>Your repair request has been submitted and will appear under "Your Requests".</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backBtnText, darkMode && styles.backBtnTextDark]}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>Request Repair</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, darkMode && styles.labelDark]}>Category</Text>
        <View style={[styles.dropdown, darkMode && styles.dropdownDark]}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.dropdownItem, category === cat && styles.dropdownItemSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.dropdownItemText, category === cat && styles.dropdownItemTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, darkMode && styles.labelDark, { marginTop: 18 }]}>Description</Text>
        <TextInput
          style={[styles.input, darkMode && styles.inputDark]}
          placeholder="Describe the issue..."
          placeholderTextColor={darkMode ? '#888' : '#999'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={[styles.submitBtn, (submitting || !description) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !description}
        >
          <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E88E5',
    marginLeft: 12,
  },
  headerTitleDark: {
    color: '#FFF',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#E8F4FD',
  },
  backBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  backBtnTextDark: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#1E88E5',
    marginBottom: 6,
  },
  labelDark: {
    color: '#FFF',
  },
  dropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dropdownDark: {
    backgroundColor: '#222',
  },
  dropdownItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  dropdownItemSelected: {
    backgroundColor: '#1E88E5',
  },
  dropdownItemText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  dropdownItemTextSelected: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  inputDark: {
    backgroundColor: '#222',
    color: '#FFF',
  },
  submitBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  submitBtnText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  confirmText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  confirmTextDark: {
    color: '#FFF',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 40,
  },
  titleDark: {
    color: '#FFF',
  },
}); 