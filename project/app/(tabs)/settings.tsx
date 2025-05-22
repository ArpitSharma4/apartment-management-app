import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ScrollView, Modal, TextInput } from 'react-native';
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
  ChevronRight, X 
} from 'lucide-react-native';
import { router } from 'expo-router';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  user: {
    name: string;
    email: string;
    apartmentNumber?: string;
    role?: string;
  } | null;
}

function ProfileModal({ visible, onClose, darkMode, user }: ProfileModalProps) {
  if (!user) return null;
  const roleDisplay: string =
    user.role === 'admin' ? 'Administrator' :
    user.role === 'resident' ? 'Resident' :
    user.role === 'staff' ? 'Staff Member' : 'User';
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.profileModalDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>👤 Profile Information</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <View style={styles.profileContent}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileField}>
                <Text style={[styles.profileLabel, darkMode && styles.profileLabelDark]}>Name</Text>
                <Text style={[styles.profileValue, darkMode && styles.profileValueDark]}>{user.name}</Text>
              </View>
              <View style={styles.profileField}>
                <Text style={[styles.profileLabel, darkMode && styles.profileLabelDark]}>Email</Text>
                <Text style={[styles.profileValue, darkMode && styles.profileValueDark]}>{user.email}</Text>
              </View>
              {user.apartmentNumber && (
                <View style={styles.profileField}>
                  <Text style={[styles.profileLabel, darkMode && styles.profileLabelDark]}>Apartment</Text>
                  <Text style={[styles.profileValue, darkMode && styles.profileValueDark]}>Unit {user.apartmentNumber}</Text>
                </View>
              )}
              <View style={styles.profileField}>
                <Text style={[styles.profileLabel, darkMode && styles.profileLabelDark]}>Role</Text>
                <Text style={[styles.profileValue, darkMode && styles.profileValueDark]}>{roleDisplay}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.editProfileButton, darkMode && styles.editProfileButtonDark]}
              onPress={onClose}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FeedbackModal({ visible, onClose, darkMode }: { visible: boolean; onClose: () => void; darkMode: boolean }) {
  const [feedback, setFeedback] = React.useState('');
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.profileModalDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Submit Feedback</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <Text style={{ color: darkMode ? '#FFF' : '#333', marginTop: 12, marginBottom: 8 }}>
            We value your feedback! Please let us know your thoughts or report any issues below.
          </Text>
          <TextInput
            style={[styles.feedbackInput, darkMode && styles.feedbackInputDark]}
            placeholder="Type your feedback here..."
            placeholderTextColor={darkMode ? '#888' : '#999'}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={5}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <TouchableOpacity onPress={onClose} style={[styles.editProfileButton, { backgroundColor: '#888', marginRight: 8 }]}> 
              <Text style={styles.editProfileButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TermsModal({ visible, onClose, darkMode }: { visible: boolean; onClose: () => void; darkMode: boolean }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.profileModalDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Terms of Service</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <ScrollView style={{ marginTop: 12, maxHeight: 300 }}>
            <Text style={{ color: darkMode ? '#FFF' : '#333', fontSize: 15 }}>
              Welcome to HomeHarbor! By using this app, you agree to abide by all community rules and regulations. 
              Your use of the app is at your own risk. We reserve the right to update these terms at any time. 
              Please respect your neighbors and use the app responsibly. For full details, contact your property manager.
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={[styles.editProfileButton, { marginTop: 16 }]}> 
            <Text style={styles.editProfileButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function PrivacyModal({ visible, onClose, darkMode }: { visible: boolean; onClose: () => void; darkMode: boolean }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.profileModalDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Privacy Policy</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <ScrollView style={{ marginTop: 12, maxHeight: 300 }}>
            <Text style={{ color: darkMode ? '#FFF' : '#333', fontSize: 15 }}>
              We respect your privacy. Your personal information is used only for managing your apartment community experience. 
              We do not sell or share your data with third parties. For questions about your data, contact your property manager.
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={[styles.editProfileButton, { marginTop: 16 }]}> 
            <Text style={styles.editProfileButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [announcementModal, setAnnouncementModal] = React.useState(false);
  const [profileModal, setProfileModal] = React.useState(false);
  const [feedbackModal, setFeedbackModal] = React.useState(false);
  const [termsModal, setTermsModal] = React.useState(false);
  const [privacyModal, setPrivacyModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const handleProfilePress = () => {
    setProfileModal(true);
  };

  const handleFeedbackPress = () => {
    setFeedbackModal(true);
  };

  const handleTermsPress = () => {
    setTermsModal(true);
  };

  const handlePrivacyPress = () => {
    setPrivacyModal(true);
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
              onValueChange={() => setDarkMode(!darkMode)}
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
      <ProfileModal visible={profileModal} onClose={() => setProfileModal(false)} darkMode={darkMode} user={user} />
      <FeedbackModal visible={feedbackModal} onClose={() => setFeedbackModal(false)} darkMode={darkMode} />
      <TermsModal visible={termsModal} onClose={() => setTermsModal(false)} darkMode={darkMode} />
      <PrivacyModal visible={privacyModal} onClose={() => setPrivacyModal(false)} darkMode={darkMode} />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxHeight: '80%',
  },
  profileModalDark: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E88E5',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  profileContent: {
    marginTop: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 40,
    color: '#FFFFFF',
  },
  profileInfo: {
    marginTop: 20,
  },
  profileField: {
    marginBottom: 10,
  },
  profileLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  profileLabelDark: {
    color: '#FFFFFF',
  },
  profileValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  profileValueDark: {
    color: '#9CA3AF',
  },
  editProfileButton: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButtonDark: {
    backgroundColor: '#333',
  },
  editProfileButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  feedbackInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  feedbackInputDark: {
    backgroundColor: '#333',
    color: '#FFF',
  },
}); 