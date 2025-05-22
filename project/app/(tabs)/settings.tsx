import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { 
  LogOut, 
  Moon, 
  Bell, 
  User, 
  MessageSquare, 
  FileText, 
  Info, 
  ChevronRight 
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [announcementModal, setAnnouncementModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const handleProfilePress = () => {
    router.push({
      pathname: '/modal',
      params: { type: 'profile' }
    });
  };

  const handleFeedbackPress = () => {
    router.push({
      pathname: '/modal',
      params: { type: 'feedback' }
    });
  };

  const handleTermsPress = () => {
    // Open terms of service
    Linking.openURL('https://example.com/terms');
  };

  const handlePrivacyPress = () => {
    // Open privacy policy
    Linking.openURL('https://example.com/privacy');
  };

  const handleUpdatePress = () => {
    // Check for updates
    // This would typically open the app store or check for updates
    Linking.openURL('https://example.com/update');
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Theme and Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Preferences</Text>
          <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
            <View style={styles.settingInfo}>
              <Moon size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#1E88E5' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, darkMode && styles.settingItemDark]}>
            <View style={styles.settingInfo}>
              <Bell size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#1E88E5' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Account</Text>
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.settingItemDark]}
            onPress={handleProfilePress}
          >
            <View style={styles.settingInfo}>
              <User size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Profile Information</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Support</Text>
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.settingItemDark]}
            onPress={handleFeedbackPress}
          >
            <View style={styles.settingInfo}>
              <MessageSquare size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Submit Feedback / Report Bug</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Legal</Text>
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.settingItemDark]}
            onPress={handleTermsPress}
          >
            <View style={styles.settingInfo}>
              <FileText size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Terms of Service</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.settingItemDark]}
            onPress={handlePrivacyPress}
          >
            <View style={styles.settingInfo}>
              <FileText size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>About</Text>
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.settingItemDark]}
            onPress={handleUpdatePress}
          >
            <View style={styles.settingInfo}>
              <Info size={24} color={darkMode ? "#FFFFFF" : "#1E88E5"} />
              <View>
                <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>Version 1.0.0</Text>
                <Text style={[styles.settingSubLabel, darkMode && styles.settingSubLabelDark]}>Check for updates</Text>
              </View>
            </View>
            <ChevronRight size={20} color={darkMode ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Quick Actions</Text>
          <TouchableOpacity
            style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
            onPress={() => setAnnouncementModal(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F4FD' }]}>
              <Bell size={24} color="#1E88E5" />
            </View>
            <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Announcements</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, darkMode && styles.logoutButtonDark]}
          onPress={handleLogout}
        >
          <LogOut size={24} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E88E5',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemDark: {
    backgroundColor: '#333',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  settingSubLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 12,
    marginTop: 2,
  },
  settingSubLabelDark: {
    color: '#9CA3AF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonDark: {
    backgroundColor: '#333',
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#E53935',
    marginLeft: 8,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
  },
  quickActionCardDark: {
    backgroundColor: '#333',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  quickActionTextDark: {
    color: '#FFFFFF',
  },
}); 