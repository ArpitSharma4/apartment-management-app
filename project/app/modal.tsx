import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ModalScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { darkMode } = useTheme();

  const renderContent = () => {
    switch (type) {
      case 'profile':
        return (
          <View style={styles.content}>
            <Text style={[styles.title, darkMode && styles.titleDark]}>Profile Information</Text>
            {/* Add profile form here */}
          </View>
        );
      case 'feedback':
        return (
          <View style={styles.content}>
            <Text style={[styles.title, darkMode && styles.titleDark]}>Submit Feedback</Text>
            {/* Add feedback form here */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
        </TouchableOpacity>
      </View>
      {renderContent()}
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
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E88E5',
    marginBottom: 24,
  },
  titleDark: {
    color: '#FFFFFF',
  },
}); 