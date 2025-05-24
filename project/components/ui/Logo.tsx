import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Home, Anchor } from 'lucide-react-native';

interface LogoProps {
  size?: number;
  darkMode?: boolean;
}

export default function Logo({ size = 120, darkMode = false }: LogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: size, height: size }]}>
        <View style={styles.iconContainer}>
          <Home size={size * 0.4} color={darkMode ? '#FFFFFF' : '#1E88E5'} />
          <Anchor size={size * 0.3} color={darkMode ? '#FFFFFF' : '#1E88E5'} style={styles.anchor} />
        </View>
      </View>
      <Text style={[styles.text, darkMode && styles.textDark]}>HomeHarbor</Text>
      <Text style={[styles.tagline, darkMode && styles.taglineDark]}>Your Safe Haven</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#E8F4FD',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchor: {
    position: 'absolute',
    bottom: -10,
    right: -10,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#1E88E5',
    marginBottom: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  taglineDark: {
    color: '#E5E7EB',
  },
}); 