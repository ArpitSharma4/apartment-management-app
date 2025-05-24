import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

export default function LoadingScreen() {
  const { darkMode } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Show welcome text after 1 second
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    // Keep the screen visible for 10 seconds
    const screenTimer = setTimeout(() => {
      // You can add navigation logic here if needed
    }, 10000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(screenTimer);
    };
  }, []);

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Logo size={160} darkMode={darkMode} />
      </Animated.View>
      {showWelcome && (
        <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.welcomeText, darkMode && styles.welcomeTextDark]}>
            Welcome to HomeHarbor
          </Text>
        </Animated.View>
      )}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={darkMode ? '#FFFFFF' : '#1E88E5'} />
        <Text style={[styles.text, darkMode && styles.textDark]}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4B5563',
  },
  textDark: {
    color: '#E5E7EB',
  },
  welcomeContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E88E5',
    textAlign: 'center',
  },
  welcomeTextDark: {
    color: '#FFFFFF',
  },
});