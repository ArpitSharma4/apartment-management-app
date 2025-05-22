import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Bell, ChartBar as BarChart4, Clock, CircleAlert as AlertCircle, Package, PenTool as Tool, Calendar, ChevronRight, Users, X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

interface WelcomeCardProps {
  name: string;
  onDismiss: () => void;
  darkMode: boolean;
}

function WelcomeCard({ name, onDismiss, darkMode }: WelcomeCardProps) {
  const [checklist, setChecklist] = React.useState([
    { label: 'Complete your profile', done: false },
    { label: 'Explore the Residents directory', done: false },
    { label: 'Check announcements', done: false },
    { label: 'Set notification preferences', done: false },
  ]);

  const handleCheck = (idx: number) => {
    setChecklist(list => list.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  return (
    <View style={[styles.welcomeCard, darkMode && styles.welcomeCardDark]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[styles.welcomeTitle, darkMode && styles.welcomeTitleDark]}>Welcome, {name}!</Text>
        <TouchableOpacity onPress={onDismiss}>
          <X size={20} color={darkMode ? '#FFF' : '#1E88E5'} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.welcomeText, darkMode && styles.welcomeTextDark]}>
        Thank you for joining HomeHarbor! Here's a quick start checklist to help you get the most out of your new account:
      </Text>
      <View style={styles.checklistContainer}>
        {checklist.map((item, idx) => (
          <TouchableOpacity key={item.label} style={styles.checklistItem} onPress={() => handleCheck(idx)}>
            <View style={[styles.checkbox, item.done && styles.checkboxChecked, darkMode && styles.checkboxDark]}>
              {item.done && <View style={styles.checkboxInner} />}
            </View>
            <Text style={[styles.checklistLabel, darkMode && styles.checklistLabelDark, item.done && styles.checklistLabelDone]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: '#1E88E5' }]} onPress={() => {/* TODO: navigate to profile */}}>
          <Text style={styles.quickActionBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: '#4CAF50' }]} onPress={() => {/* TODO: navigate to directory */}}>
          <Text style={styles.quickActionBtnText}>Directory</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: '#FFC107' }]} onPress={() => {/* TODO: navigate to announcements */}}>
          <Text style={styles.quickActionBtnText}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: '#333' }]} onPress={() => {/* TODO: navigate to settings */}}>
          <Text style={styles.quickActionBtnText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AdminApprovals() {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const { darkMode } = useTheme();
  if (!pendingUsers || pendingUsers.length === 0) return null;
  return (
    <View style={[styles.approvalsContainer, darkMode && styles.approvalsContainerDark]}>
      <Text style={[styles.approvalsTitle, darkMode && styles.approvalsTitleDark]}>Pending Approvals</Text>
      {pendingUsers.map(user => (
        <View key={user.id} style={styles.approvalItem}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.approvalName, darkMode && styles.approvalNameDark]}>{user.name} ({user.email})</Text>
            {user.apartmentNumber && (
              <Text style={[styles.approvalSub, darkMode && styles.approvalSubDark]}>Apt: {user.apartmentNumber}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => approveUser(user.id)} style={styles.approveBtn}>
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => rejectUser(user.id)} style={styles.rejectBtn}>
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

function AnnouncementModal({ visible, onClose, darkMode }: AnnouncementModalProps) {
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [type, setType] = React.useState('General Notice');
  const [audience, setAudience] = React.useState('All Residents');
  const [priority, setPriority] = React.useState('Low');
  const [scheduleLater, setScheduleLater] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [visibilityDays, setVisibilityDays] = React.useState('3');
  const [push, setPush] = React.useState(true);
  const [preview, setPreview] = React.useState(false);
  // For demo, attachments and log are not functional

  const typeOptions = [
    'General Notice',
    'Maintenance',
    'Emergency',
    'Events',
    'Payment Reminders',
    'Security Alert',
  ];
  const audienceOptions = [
    'All Residents',
    'Specific Block/Wing/Flat',
    'Staff Only',
  ];
  const priorityOptions = [
    'Low',
    'Medium',
    'High',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.announcementModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>📝 Create Announcement</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 350 }}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={[styles.input, darkMode && styles.inputDark]}
              placeholder="e.g., Water Supply Interruption"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.inputLabel}>Message/Body</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, darkMode && styles.inputDark]}
              placeholder="Type your message here..."
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.inputLabel}>Category/Type</Text>
            <View style={styles.dropdownRow}>
              {typeOptions.map(opt => (
                <TouchableOpacity key={opt} style={[styles.dropdownBtn, type === opt && styles.dropdownBtnActive]} onPress={() => setType(opt)}>
                  <Text style={[styles.dropdownBtnText, type === opt && styles.dropdownBtnTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.inputLabel}>Target Audience</Text>
            <View style={styles.dropdownRow}>
              {audienceOptions.map(opt => (
                <TouchableOpacity key={opt} style={[styles.dropdownBtn, audience === opt && styles.dropdownBtnActive]} onPress={() => setAudience(opt)}>
                  <Text style={[styles.dropdownBtnText, audience === opt && styles.dropdownBtnTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.dropdownRow}>
              {priorityOptions.map(opt => (
                <TouchableOpacity key={opt} style={[styles.dropdownBtn, priority === opt && styles.dropdownBtnActive, opt === 'Low' && { borderColor: '#4CAF50' }, opt === 'Medium' && { borderColor: '#FFC107' }, opt === 'High' && { borderColor: '#E53935' }]} onPress={() => setPriority(opt)}>
                  <Text style={[styles.dropdownBtnText, priority === opt && styles.dropdownBtnTextActive, opt === 'Low' && { color: '#4CAF50' }, opt === 'Medium' && { color: '#FFC107' }, opt === 'High' && { color: '#E53935' }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.inputLabel}>Attachment Upload</Text>
            <TouchableOpacity style={styles.attachmentBtn}>
              <Text style={styles.attachmentBtnText}>+ Add Attachment (images, PDFs)</Text>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Schedule Announcement</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Switch value={scheduleLater} onValueChange={setScheduleLater} />
              <Text style={{ marginLeft: 8 }}>Schedule Later</Text>
              {scheduleLater && (
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBtn}>
                  <Text style={styles.dateBtnText}>{scheduleDate.toLocaleString()}</Text>
                </TouchableOpacity>
              )}
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={scheduleDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) setScheduleDate(date);
                }}
              />
            )}
            <Text style={styles.inputLabel}>Visibility Duration (days)</Text>
            <TextInput
              style={[styles.input, darkMode && styles.inputDark]}
              value={visibilityDays}
              onChangeText={setVisibilityDays}
              keyboardType="numeric"
              placeholder="e.g., 3"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <Switch value={push} onValueChange={setPush} />
              <Text style={{ marginLeft: 8 }}>Send Push Notification</Text>
            </View>
            <TouchableOpacity style={styles.previewBtn} onPress={() => setPreview(true)}>
              <Text style={styles.previewBtnText}>Preview</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark, { marginTop: 16 }]}>📋 Past Announcements Log</Text>
          <View style={styles.announcementLogStub}>
            <Text style={{ color: darkMode ? '#FFF' : '#333', textAlign: 'center' }}>
              (Demo) No announcements yet. This section will show all past announcements with filters, edit/delete, and engagement insights.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const { user, userRole } = useAuth();
  const { darkMode } = useTheme();
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<{title: string, description: string, time: string, icon: React.ReactNode} | null>(null);
  const [announcementModal, setAnnouncementModal] = React.useState(false);
  const router = useRouter();

  // Only show welcome for non-demo users (not admin@example.com, resident@example.com, staff@example.com)
  const isDemoUser = user?.email === 'admin@example.com' || user?.email === 'resident@example.com' || user?.email === 'staff@example.com';
  const shouldShowWelcome = showWelcome && user && !isDemoUser;
  
  const handleActivityPress = (activity: {title: string, description: string, time: string, icon: React.ReactNode}) => {
    setModalContent(activity);
    setModalVisible(true);
  };

  const renderAdminDashboard = () => {
    return (
      <>
        <View style={[styles.statsContainer, darkMode && styles.statsContainerDark]}>
          <View style={[styles.statCard, darkMode && styles.statCardDark]}>
            <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>24</Text>
            <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>Apartments</Text>
          </View>
          <View style={[styles.statCard, darkMode && styles.statCardDark]}>
            <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>18</Text>
            <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>Occupied</Text>
          </View>
          <View style={[styles.statCard, darkMode && styles.statCardDark]}>
            <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>6</Text>
            <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>Available</Text>
          </View>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, darkMode && styles.seeAllTextDark]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => handleActivityPress({
              title: 'New Maintenance Request',
              description: 'Unit 304 - Leaking Faucet',
              time: '10 minutes ago',
              icon: <AlertCircle size={20} color="#E53935" />
            })}
            style={[styles.activityCard, darkMode && styles.activityCardDark]}
          >
            <View style={styles.activityIconContainer}>
              <AlertCircle size={20} color="#E53935" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>New Maintenance Request</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Unit 304 - Leaking Faucet</Text>
              <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>10 minutes ago</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleActivityPress({
              title: 'Package Delivered',
              description: 'Unit 201 - Amazon',
              time: '1 hour ago',
              icon: <Package size={20} color="#1E88E5" />
            })}
            style={[styles.activityCard, darkMode && styles.activityCardDark]}
          >
            <View style={styles.activityIconContainer}>
              <Package size={20} color="#1E88E5" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>Package Delivered</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Unit 201 - Amazon</Text>
              <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>1 hour ago</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleActivityPress({
              title: 'New Resident',
              description: 'Unit 105 - John Smith',
              time: '2 days ago',
              icon: <Users size={20} color="#4CAF50" />
            })}
            style={[styles.activityCard, darkMode && styles.activityCardDark]}
          >
            <View style={styles.activityIconContainer}>
              <Users size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>New Resident</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Unit 105 - John Smith</Text>
              <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>2 days ago</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => router.push('/announcements')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F4FD' }]}>
                <Bell size={24} color="#1E88E5" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Announcements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Tool size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Maintenance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF8E1' }]}>
                <BarChart4 size={24} color="#FFC107" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Calendar size={24} color="#9C27B0" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  
  const renderResidentDashboard = () => {
    return (
      <>
        <View style={[styles.announcementBanner, darkMode && styles.announcementBannerDark]}>
          <Bell size={20} color="#FFFFFF" />
          <Text style={styles.announcementText}>
            Building inspection scheduled for June 15th
          </Text>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Tool size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Request Repair</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F4FD' }]}>
                <Users size={24} color="#1E88E5" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Invite Visitor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF8E1' }]}>
                <Calendar size={24} color="#FFC107" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Book Amenity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
                <AlertCircle size={24} color="#E53935" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Your Requests</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, darkMode && styles.seeAllTextDark]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.activityCard, darkMode && styles.activityCardDark]}>
            <View style={[styles.activityIconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Tool size={20} color="#E53935" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>Kitchen Sink Repair</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Status: In Progress</Text>
              <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>Submitted 2 days ago</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
          
          <View style={[styles.activityCard, darkMode && styles.activityCardDark]}>
            <View style={[styles.activityIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Tool size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>AC Maintenance</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Status: Completed</Text>
              <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>Completed 1 week ago</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Upcoming Events</Text>
          </View>
          
          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>18</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Community Barbecue</Text>
              <Text style={styles.eventTime}>
                <Clock size={14} color="#6B7280" style={{ marginRight: 4 }} /> 
                Saturday, 4:00 PM - 7:00 PM
              </Text>
              <Text style={styles.eventLocation}>Pool Area</Text>
            </View>
          </View>
          
          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>25</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Resident Meeting</Text>
              <Text style={styles.eventTime}>
                <Clock size={14} color="#6B7280" style={{ marginRight: 4 }} /> 
                Saturday, 6:00 PM - 7:00 PM
              </Text>
              <Text style={styles.eventLocation}>Community Hall</Text>
            </View>
          </View>
        </View>
      </>
    );
  };
  
  const renderStaffDashboard = () => {
    return (
      <>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Maintenance Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskCard}>
            <View style={[styles.taskPriority, { backgroundColor: '#E53935' }]} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Fix Leaking Faucet</Text>
              <Text style={styles.taskLocation}>Unit 304</Text>
              <Text style={styles.taskTime}>Reported 10 minutes ago</Text>
              <View style={styles.taskStatus}>
                <Text style={styles.taskStatusText}>High Priority</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.taskAction}>
              <Text style={styles.taskActionText}>Accept</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskCard}>
            <View style={[styles.taskPriority, { backgroundColor: '#FFC107' }]} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Replace Light Bulb</Text>
              <Text style={styles.taskLocation}>Unit 207 - Hallway</Text>
              <Text style={styles.taskTime}>Reported yesterday</Text>
              <View style={[styles.taskStatus, { backgroundColor: '#FFF8E1' }]}>
                <Text style={[styles.taskStatusText, { color: '#FF8F00' }]}>Medium Priority</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.taskAction}>
              <Text style={styles.taskActionText}>Accept</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskCard}>
            <View style={[styles.taskPriority, { backgroundColor: '#4CAF50' }]} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Check AC Unit</Text>
              <Text style={styles.taskLocation}>Unit 512</Text>
              <Text style={styles.taskTime}>Reported 2 days ago</Text>
              <View style={[styles.taskStatus, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.taskStatusText, { color: '#2E7D32' }]}>Low Priority</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.taskAction}>
              <Text style={styles.taskActionText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Progress</Text>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Tool size={20} color="#1E88E5" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>AC Maintenance</Text>
              <Text style={styles.activityDescription}>Unit 105 - Started 3 hours ago</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
          </View>
          
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTime}>10:00 AM</Text>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Pool Maintenance</Text>
              <Text style={styles.scheduleDescription}>Regular cleaning and chemical check</Text>
            </View>
          </View>
          
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTime}>2:00 PM</Text>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Package Delivery</Text>
              <Text style={styles.scheduleDescription}>Distribute packages to residents</Text>
            </View>
          </View>
          
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTime}>4:00 PM</Text>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Grounds Inspection</Text>
              <Text style={styles.scheduleDescription}>Check landscaping and common areas</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>
            Welcome, {user?.name || 'User'}
          </Text>
          <Text style={[styles.headerSubtitle, darkMode && styles.headerSubtitleDark]}>
            {userRole === 'admin' ? 'Administrator' : userRole === 'staff' ? 'Staff Member' : 'Resident - Unit 304'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#1E88E5" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      {userRole === 'admin' && <AdminApprovals />}
      {shouldShowWelcome && (
        <WelcomeCard name={user?.name || 'User'} onDismiss={() => setShowWelcome(false)} darkMode={darkMode} />
      )}
      <AnnouncementModal visible={announcementModal} onClose={() => setAnnouncementModal(false)} darkMode={darkMode} />
      {/* Activity Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, darkMode && styles.modalContentDark]}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              {modalContent?.icon}
            </View>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>{modalContent?.title}</Text>
            <Text style={[styles.modalDescription, darkMode && styles.modalDescriptionDark]}>{modalContent?.description}</Text>
            <Text style={[styles.modalTime, darkMode && styles.modalTimeDark]}>{modalContent?.time}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView 
        style={[styles.scrollView, darkMode && styles.scrollViewDark]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userRole === 'admin' && renderAdminDashboard()}
        {userRole === 'resident' && renderResidentDashboard()}
        {userRole === 'staff' && renderStaffDashboard()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerSubtitleDark: {
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E53935',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewDark: {
    backgroundColor: '#1E1E1E',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statsContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  statCardDark: {
    backgroundColor: '#333',
  },
  statNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#1E88E5',
    marginBottom: 4,
  },
  statNumberDark: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  statLabelDark: {
    color: '#FFFFFF',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E88E5',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  seeAllTextDark: {
    color: '#FFFFFF',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  activityCardDark: {
    backgroundColor: '#333',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
  },
  activityTitleDark: {
    color: '#FFFFFF',
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  activityDescriptionDark: {
    color: '#FFFFFF',
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  activityTimeDark: {
    color: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  quickActionCardDark: {
    backgroundColor: '#333',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  quickActionTextDark: {
    color: '#FFFFFF',
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  announcementBannerDark: {
    backgroundColor: '#333',
  },
  announcementText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    overflow: 'hidden',
  },
  eventDateContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E88E5',
    padding: 12,
  },
  eventMonth: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  eventDay: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  eventTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    overflow: 'hidden',
  },
  taskPriority: {
    width: 8,
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  taskLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  taskTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 8,
  },
  taskStatus: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  taskStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#E53935',
  },
  taskAction: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  taskActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1E88E5',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginTop: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#1E88E5',
    borderRadius: 3,
  },
  completeButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  completeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4CAF50',
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  scheduleTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1E88E5',
    width: 70,
  },
  scheduleDivider: {
    width: 2,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  scheduleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  approvalsContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    marginBottom: 0,
  },
  approvalsContainerDark: {
    backgroundColor: '#333',
  },
  approvalsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#E53935',
    marginBottom: 8,
  },
  approvalsTitleDark: {
    color: '#FFD54F',
  },
  approvalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  approvalName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  approvalNameDark: {
    color: '#FFF',
  },
  approvalSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  approvalSubDark: {
    color: '#BDBDBD',
  },
  approveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  approveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  rejectBtn: {
    backgroundColor: '#E53935',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  rejectBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeCardDark: {
    backgroundColor: '#222',
  },
  welcomeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E88E5',
  },
  welcomeTitleDark: {
    color: '#FFF',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
    marginTop: 8,
  },
  welcomeTextDark: {
    color: '#FFF',
  },
  checklistContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1E88E5',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  checkboxDark: {
    backgroundColor: '#222',
    borderColor: '#81b0ff',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  checklistLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
  },
  checklistLabelDark: {
    color: '#FFF',
  },
  checklistLabelDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionBtnText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalContentDark: {
    backgroundColor: '#222',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E88E5',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTitleDark: {
    color: '#FFF',
  },
  modalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescriptionDark: {
    color: '#FFF',
  },
  modalTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalTimeDark: {
    color: '#FFD54F',
  },
  modalCloseBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  announcementModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'stretch',
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E88E5',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  inputDark: {
    backgroundColor: '#222',
    color: '#FFF',
    borderColor: '#444',
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  dropdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dropdownBtn: {
    borderWidth: 1,
    borderColor: '#1E88E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  dropdownBtnActive: {
    backgroundColor: '#1E88E5',
  },
  dropdownBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  dropdownBtnTextActive: {
    color: '#FFF',
  },
  attachmentBtn: {
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  dateBtn: {
    marginLeft: 8,
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dateBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  previewBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  previewBtnText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  announcementLogStub: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
});