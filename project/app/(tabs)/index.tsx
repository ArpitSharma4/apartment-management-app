import React, { useState, useEffect } from 'react';
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
import { Bell, ChartBar as BarChart4, Clock, CircleAlert as AlertCircle, Package, PenTool as Tool, Calendar, ChevronRight, Users, X, Wrench, Droplets, Zap, FileText, Download, Calendar as CalendarIcon, ChevronDown, Save, Moon, QrCode, CheckCircle2, AlertTriangle, Home as HomeIcon, Building2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

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

interface MaintenanceModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

function MaintenanceModal({ visible, onClose, darkMode }: MaintenanceModalProps) {
  // Demo data
  const summary = [
    { label: 'New Requests', count: 3, icon: <Wrench size={22} color="#E53935" />, color: '#FFEAEA' },
    { label: 'Pending', count: 7, icon: <Wrench size={22} color="#FFC107" />, color: '#FFF8E1' },
    { label: 'Resolved', count: 21, icon: <Wrench size={22} color="#4CAF50" />, color: '#E8F5E9' },
  ];
  const recent = [
    { icon: <Droplets size={20} color="#1E88E5" />, text: 'Leaking Faucet – Unit 304', time: '10 mins ago' },
    { icon: <Zap size={20} color="#FFC107" />, text: 'Power Issue – Unit 110', time: '1 hour ago' },
  ];
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.maintenanceModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>🛠️ Maintenance</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
            </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
            {summary.map((s, i) => (
              <View key={s.label} style={[styles.maintSummaryCard, { backgroundColor: s.color, marginRight: i < summary.length - 1 ? 12 : 0 }]}> 
                {s.icon}
                <Text style={styles.maintSummaryCount}>{s.count}</Text>
                <Text style={styles.maintSummaryLabel}>{s.label}</Text>
            </View>
            ))}
          </ScrollView>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark, { marginBottom: 8 }]}>Recent Requests</Text>
          {recent.map((r, i) => (
            <View key={i} style={[styles.maintRecentCard, darkMode && styles.maintRecentCardDark]}> 
              {r.icon}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.maintRecentText}>{r.text}</Text>
                <Text style={styles.maintRecentTime}>{r.time}</Text>
          </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

interface ReportsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

function ReportsModal({ visible, onClose, darkMode }: ReportsModalProps) {
  const [showTypes, setShowTypes] = React.useState(false);
  const [exportType, setExportType] = React.useState<'CSV' | 'PDF'>('CSV');
  const [dateFilter, setDateFilter] = React.useState<'This Month' | 'Last Month'>('This Month');
  const lastUpdated = 'May 22, 2025 · 12:30 PM';
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.reportsModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>📊 Reports</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          <View style={{ marginVertical: 16 }}>
            <TouchableOpacity style={styles.reportActionBtn} onPress={() => setShowTypes(v => !v)}>
              <FileText size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={styles.reportActionText}>View Summary Reports</Text>
              <ChevronDown size={18} color="#1E88E5" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {showTypes && (
              <View style={styles.reportTypesList}>
                <Text style={styles.reportTypeItem}>• Occupancy</Text>
                <Text style={styles.reportTypeItem}>• Maintenance</Text>
                <Text style={styles.reportTypeItem}>• Payments</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.exportBtn, exportType === 'CSV' && styles.exportBtnActive]}
                onPress={() => setExportType('CSV')}
              >
                <Download size={18} color={exportType === 'CSV' ? '#FFF' : '#1E88E5'} />
                <Text style={[styles.exportBtnText, exportType === 'CSV' && styles.exportBtnTextActive]}>Export CSV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.exportBtn, exportType === 'PDF' && styles.exportBtnActive]}
                onPress={() => setExportType('PDF')}
              >
                <Download size={18} color={exportType === 'PDF' ? '#FFF' : '#1E88E5'} />
                <Text style={[styles.exportBtnText, exportType === 'PDF' && styles.exportBtnTextActive]}>Export PDF</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.dateFilterBtn, dateFilter === 'This Month' && styles.dateFilterBtnActive]}
                onPress={() => setDateFilter('This Month')}
              >
                <CalendarIcon size={16} color={dateFilter === 'This Month' ? '#FFF' : '#1E88E5'} />
                <Text style={[styles.dateFilterText, dateFilter === 'This Month' && styles.dateFilterTextActive]}>This Month</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateFilterBtn, dateFilter === 'Last Month' && styles.dateFilterBtnActive]}
                onPress={() => setDateFilter('Last Month')}
              >
                <CalendarIcon size={16} color={dateFilter === 'Last Month' ? '#FFF' : '#1E88E5'} />
                <Text style={[styles.dateFilterText, dateFilter === 'Last Month' && styles.dateFilterTextActive]}>Last Month</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.lastUpdatedText}>Last updated: {lastUpdated}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  onSave: (activity: Activity) => void;
}

function ScheduleModal({ visible, onClose, darkMode, onSave }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [note, setNote] = React.useState('');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const handleSave = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: 'New Schedule Added',
      description: note || 'Scheduled Event',
      time: 'Just now',
      icon: <Calendar size={20} color="#1E88E5" />
    };
    onSave(newActivity);
    onClose();
    // Reset form
    setNote('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.scheduleModal, darkMode && styles.modalContentDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>🗓️ Manage Schedule</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>

          <View style={styles.scheduleModalContent}>
            {/* Date Picker */}
            <TouchableOpacity 
              style={[styles.scheduleField, darkMode && styles.scheduleFieldDark]}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon size={20} color={darkMode ? '#FFF' : '#1E88E5'} style={{ marginRight: 8 }} />
              <Text style={[styles.scheduleFieldText, darkMode && styles.scheduleFieldTextDark]}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {/* Time Picker */}
            <TouchableOpacity 
              style={[styles.scheduleField, darkMode && styles.scheduleFieldDark]}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={darkMode ? '#FFF' : '#1E88E5'} style={{ marginRight: 8 }} />
              <Text style={[styles.scheduleFieldText, darkMode && styles.scheduleFieldTextDark]}>
                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {/* Note Field */}
            <View style={styles.noteContainer}>
              <Text style={[styles.noteLabel, darkMode && styles.noteLabelDark]}>Note (Optional)</Text>
              <TextInput
                style={[styles.noteInput, darkMode && styles.noteInputDark]}
                placeholder="e.g., Water Tank Cleaning"
                placeholderTextColor={darkMode ? '#666' : '#999'}
                value={note}
                onChangeText={setNote}
                multiline
              />
            </View>

            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            {/* Time Picker Modal */}
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, time) => {
                  setShowTimePicker(false);
                  if (time) setSelectedTime(time);
                }}
              />
            )}

            {/* Action Buttons */}
            <View style={styles.scheduleActions}>
              <TouchableOpacity 
                style={[styles.scheduleButton, styles.cancelButton, darkMode && styles.cancelButtonDark]}
                onPress={onClose}
              >
                <Text style={[styles.scheduleButtonText, styles.cancelButtonText, darkMode && styles.cancelButtonTextDark]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.scheduleButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Save size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Fix: Add explicit prop types
interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

function InviteVisitorModal({ visible, onClose, darkMode, onInviteVisitor }: SimpleModalProps & { onInviteVisitor: (name: string, visitTime: string, purpose: string) => void }) {
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [visitTime, setVisitTime] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    onInviteVisitor(name, visitTime, purpose);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Invite Visitor</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          {submitted ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <QrCode size={64} color="#1E88E5" />
              <Text style={{ color: darkMode ? '#FFF' : '#1E88E5', fontSize: 18, fontFamily: 'Inter-SemiBold', marginTop: 12 }}>Gate Pass Generated</Text>
              <Text style={{ color: darkMode ? '#FFF' : '#333', marginTop: 8, textAlign: 'center' }}>Show this QR code at the gate for visitor entry.</Text>
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 24 }]} onPress={onClose}>
                <Text style={styles.editProfileButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Visitor Name" placeholderTextColor={darkMode ? '#888' : '#999'} value={name} onChangeText={setName} />
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Mobile Number" placeholderTextColor={darkMode ? '#888' : '#999'} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Visit Time (e.g., 2024-06-01 15:00)" placeholderTextColor={darkMode ? '#888' : '#999'} value={visitTime} onChangeText={setVisitTime} />
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Purpose" placeholderTextColor={darkMode ? '#888' : '#999'} value={purpose} onChangeText={setPurpose} />
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 12 }]} onPress={handleSubmit} disabled={!name || !mobile || !visitTime || !purpose}>
                <Text style={styles.editProfileButtonText}>Generate Pass</Text>
              </TouchableOpacity>
            </>
          )}
          </View>
          </View>
    </Modal>
  );
}

function BookAmenityModal({ visible, onClose, darkMode, onBookAmenity }: SimpleModalProps & { onBookAmenity: (amenity: string, date: string, time: string) => void }) {
  const [amenity, setAmenity] = React.useState('Gym');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const amenities = ['Gym', 'Clubhouse', 'Pool', 'Tennis Court'];
  const handleConfirm = () => {
    setSubmitted(true);
    onBookAmenity(amenity, date, time);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Book Amenity</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          {submitted ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <CheckCircle2 size={64} color="#4CAF50" />
              <Text style={{ color: darkMode ? '#FFF' : '#4CAF50', fontSize: 18, fontFamily: 'Inter-SemiBold', marginTop: 12 }}>Booking Confirmed</Text>
              <Text style={{ color: darkMode ? '#FFF' : '#333', marginTop: 8, textAlign: 'center' }}>Your booking for the {amenity} is confirmed.</Text>
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 24 }]} onPress={onClose}>
                <Text style={styles.editProfileButtonText}>Done</Text>
              </TouchableOpacity>
        </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {amenities.map(a => (
                  <TouchableOpacity key={a} style={[styles.dropdownBtn, amenity === a && styles.dropdownBtnActive]} onPress={() => setAmenity(a)}>
                    <Text style={[styles.dropdownBtnText, amenity === a && styles.dropdownBtnTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Date (e.g., 2024-06-01)" placeholderTextColor={darkMode ? '#888' : '#999'} value={date} onChangeText={setDate} />
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Time Slot (e.g., 16:00-17:00)" placeholderTextColor={darkMode ? '#888' : '#999'} value={time} onChangeText={setTime} />
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 12 }]} onPress={handleConfirm} disabled={!date || !time}>
                <Text style={styles.editProfileButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

interface ReportIssueModalProps extends SimpleModalProps {
  onIssueReported: (issueType: string, description: string) => void;
}

function ReportIssueModal({ visible, onClose, darkMode, onIssueReported }: ReportIssueModalProps) {
  const [issueType, setIssueType] = React.useState('Noise');
  const [description, setDescription] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const issueTypes = ['Noise', 'Security', 'Sanitation', 'Other'];
  
  const handleSubmit = () => {
    setSubmitted(true);
    onIssueReported(issueType, description);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.modalContentDark]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Report Issue</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
          </View>
          {submitted ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <AlertTriangle size={64} color="#FFC107" />
              <Text style={{ color: darkMode ? '#FFF' : '#FFC107', fontSize: 18, fontFamily: 'Inter-SemiBold', marginTop: 12 }}>Report Submitted</Text>
              <Text style={{ color: darkMode ? '#FFF' : '#333', marginTop: 8, textAlign: 'center' }}>Your issue has been sent to the relevant authority.</Text>
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 24 }]} onPress={onClose}>
                <Text style={styles.editProfileButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {issueTypes.map(t => (
                  <TouchableOpacity key={t} style={[styles.dropdownBtn, issueType === t && styles.dropdownBtnActive]} onPress={() => setIssueType(t)}>
                    <Text style={[styles.dropdownBtnText, issueType === t && styles.dropdownBtnTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={[styles.input, darkMode && styles.inputDark]} placeholder="Describe the issue..." placeholderTextColor={darkMode ? '#888' : '#999'} value={description} onChangeText={setDescription} multiline numberOfLines={4} />
              <TouchableOpacity style={[styles.editProfileButton, { marginTop: 12 }]} onPress={handleSubmit} disabled={!description}>
                <Text style={styles.editProfileButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Extend Activity for repair requests
interface ResidentRequest extends Activity {
  status: string;
  description: string;
}

function ViewRequestsModal({ visible, onClose, darkMode, requests }: SimpleModalProps & { requests: ResidentRequest[] }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.profileModal, darkMode && styles.modalContentDark]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Your Requests</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={darkMode ? '#FFF' : '#1E88E5'} /></TouchableOpacity>
            </View>
          <ScrollView style={{ maxHeight: 400 }}>
            {requests.map(request => (
              <View key={request.id} style={[styles.requestCard, darkMode && styles.requestCardDark]}>
                <View style={[styles.requestIconContainer, { backgroundColor: request.status === 'Completed' ? '#E8F5E9' : '#FFEBEE' }]}>
                  {request.icon}
            </View>
                <View style={styles.requestContent}>
                  <Text style={[styles.requestTitle, darkMode && styles.requestTitleDark]}>{request.title}</Text>
                  <Text style={[styles.requestStatus, { color: request.status === 'Completed' ? '#4CAF50' : '#E53935' }]}>
                    Status: {request.status}
                  </Text>
                  <Text style={[styles.requestDescription, darkMode && styles.requestDescriptionDark]}>
                    {request.description}
                  </Text>
                  <Text style={[styles.requestTime, darkMode && styles.requestTimeDark]}>{request.time}</Text>
          </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Helper for priority color
const PRIORITY_COLORS = {
  High: '#E53935',
  Medium: '#FFC107',
  Low: '#4CAF50',
};

type TaskPriority = 'High' | 'Medium' | 'Low';
interface StaffTask {
  id: string;
  title: string;
  location: string;
  time: string;
  priority: TaskPriority;
}

interface StaffTaskCardProps {
  task: StaffTask;
  status: 'pending' | 'accepted' | 'rejected';
  onAccept: () => void;
  onReject: () => void;
  darkMode: boolean;
}

function StaffTaskCard({ task, status, onAccept, onReject, darkMode }: StaffTaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority];
  let bgColor = '#FFF';
  let statusText = '';
  let statusBg = undefined;
  if (status === 'accepted') {
    bgColor = '#E8F5E9';
    statusText = 'Accepted';
    statusBg = { backgroundColor: '#4CAF50' };
  } else if (status === 'rejected') {
    bgColor = '#FFEBEE';
    statusText = 'Rejected';
    statusBg = { backgroundColor: '#E53935' };
  }
  return (
    <Swipeable
      renderLeftActions={() => (
        <View style={{ flex: 1, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'flex-start', borderRadius: 12 }}>
          <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 16, marginLeft: 24 }}>Accepted</Text>
        </View>
      )}
      renderRightActions={() => (
        <View style={{ flex: 1, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'flex-end', borderRadius: 12 }}>
          <Text style={{ color: '#E53935', fontWeight: 'bold', fontSize: 16, marginRight: 24 }}>Rejected</Text>
        </View>
      )}
      onSwipeableLeftOpen={() => {
        onAccept();
      }}
      onSwipeableRightOpen={() => {
        onReject();
      }}
      overshootLeft={false}
      overshootRight={false}
      enabled={status === 'pending'}
    >
      <View 
        style={[styles.taskCard, darkMode && styles.taskCardDark, { backgroundColor: bgColor }, darkMode && status === 'pending' && { backgroundColor: '#222' }]}
        // Remove any onPress handlers to prevent task details from showing
      >
        <View style={[styles.taskPriority, { backgroundColor: priorityColor }]} />
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, darkMode && styles.taskTitleDark]}>{task.title}</Text>
          <Text style={[styles.taskLocation, darkMode && styles.taskLocationDark]}>{task.location}</Text>
          <Text style={[styles.taskTime, darkMode && styles.taskTimeDark]}>{task.time}</Text>
          <View style={[styles.taskStatus, { backgroundColor: priorityColor + '22' }, darkMode && styles.taskStatusDark]}>
            <Text style={[styles.taskStatusText, { color: priorityColor }, darkMode && styles.taskStatusTextDark]}>{task.priority} Priority</Text>
          </View>
          {status !== 'pending' && (
            <View style={[styles.taskStatus, statusBg, { marginTop: 8 }]}> 
              <Text style={[styles.taskStatusText, { color: '#FFF' }]}>{statusText}</Text>
            </View>
          )}
        </View>
      </View>
    </Swipeable>
  );
}

const STAFF_TASKS: StaffTask[] = [
  {
    id: '1',
    title: 'Fix Leaking Faucet',
    location: 'Unit 304',
    time: 'Reported 10 minutes ago',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Replace Light Bulb',
    location: 'Unit 207 - Hallway',
    time: 'Reported yesterday',
    priority: 'Medium',
  },
  {
    id: '3',
    title: 'Check AC Unit',
    location: 'Unit 512',
    time: 'Reported 2 days ago',
    priority: 'Low',
  },
];

// Add at the top: categories for repair
const REPAIR_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Appliance',
  'Other',
];

export default function HomeScreen() {
  const { user, userRole } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<{title: string, description: string, time: string, icon: React.ReactNode} | null>(null);
  const [announcementModal, setAnnouncementModal] = React.useState(false);
  const [maintenanceModal, setMaintenanceModal] = React.useState(false);
  const [reportsModal, setReportsModal] = React.useState(false);
  const [scheduleModal, setScheduleModal] = React.useState(false);
  const router = useRouter();
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: '1',
      title: 'New Maintenance Request',
      description: 'Unit 304 - Leaking Faucet',
      time: '10 minutes ago',
      icon: <AlertCircle size={20} color="#E53935" />
    },
    {
      id: '2',
      title: 'Package Delivered',
      description: 'Unit 201 - Amazon',
      time: '1 hour ago',
      icon: <Package size={20} color="#1E88E5" />
    },
    {
      id: '3',
      title: 'New Resident',
      description: 'Unit 105 - John Smith',
      time: '2 days ago',
      icon: <Users size={20} color="#4CAF50" />
    }
  ]);
  const [inviteVisitorModal, setInviteVisitorModal] = React.useState(false);
  const [bookAmenityModal, setBookAmenityModal] = React.useState(false);
  const [reportIssueModal, setReportIssueModal] = React.useState(false);
  const [viewRequestsModal, setViewRequestsModal] = React.useState(false);

  // Update the task status management
  const [taskStatuses, setTaskStatuses] = React.useState<{ [id: string]: 'pending' | 'accepted' | 'rejected' }>({
    '1': 'pending',
    '2': 'pending',
    '3': 'pending',
  });

  const [visibleTasks, setVisibleTasks] = React.useState(STAFF_TASKS);
  const [acceptedTasks, setAcceptedTasks] = React.useState<StaffTask[]>([]);

  const [isProcessingAction, setIsProcessingAction] = React.useState(false);

  const handleAccept = (id: string) => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    setTaskStatuses(s => ({ ...s, [id]: 'accepted' }));
    // Add the task to accepted tasks only if it's not already there
    const taskToAccept = STAFF_TASKS.find(task => task.id === id);
    if (taskToAccept) {
      setAcceptedTasks(prev => {
        // Check if task already exists in acceptedTasks
        if (prev.some(task => task.id === id)) {
          return prev;
        }
        return [...prev, taskToAccept];
      });
    }
    // Remove the task after a short delay
    setTimeout(() => {
      setVisibleTasks(tasks => tasks.filter(task => task.id !== id));
      setIsProcessingAction(false);
    }, 300);
  };

  const handleReject = (id: string) => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    setTaskStatuses(s => ({ ...s, [id]: 'rejected' }));
    // Remove the task after a short delay
    setTimeout(() => {
      setVisibleTasks(tasks => tasks.filter(task => task.id !== id));
      setIsProcessingAction(false);
    }, 300);
  };

  // Only show welcome for non-demo users (not admin@example.com, resident@example.com, staff@example.com)
  const isDemoUser = user?.email === 'admin@example.com' || user?.email === 'resident@example.com' || user?.email === 'staff@example.com';
  const shouldShowWelcome = showWelcome && user && !isDemoUser;
  
  const handleActivityPress = (activity: Activity) => {
    setModalContent(activity);
    setModalVisible(true);
  };

  const handleActivitySave = (newActivity: Activity) => {
    setActivities(prev => [newActivity, ...prev]);
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
          
          {activities.map(activity => (
            <TouchableOpacity
              key={activity.id}
              onPress={() => handleActivityPress(activity)}
              style={[styles.activityCard, darkMode && styles.activityCardDark]}
            >
            <View style={styles.activityIconContainer}>
                {activity.icon}
            </View>
            <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>{activity.title}</Text>
                <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>{activity.description}</Text>
                <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>{activity.time}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
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
            
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setMaintenanceModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Tool size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Maintenance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setReportsModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF8E1' }]}>
                <BarChart4 size={24} color="#FFC107" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setScheduleModal(true)}
            >
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
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setRepairModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Tool size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Request Repair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setInviteVisitorModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F4FD' }]}>
                <Users size={24} color="#1E88E5" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Invite Visitor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setBookAmenityModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF8E1' }]}>
                <CalendarIcon size={24} color="#FFC107" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Book Amenity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => setReportIssueModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
                <AlertTriangle size={24} color="#E53935" />
              </View>
              <Text style={[styles.quickActionText, darkMode && styles.quickActionTextDark]}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Your Requests</Text>
            <TouchableOpacity onPress={() => setViewRequestsModal(true)}>
              <Text style={[styles.seeAllText, darkMode && styles.seeAllTextDark]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {residentRequests.map(request => (
            <TouchableOpacity 
              key={request.id}
              style={[styles.activityCard, darkMode && styles.activityCardDark]}
              onPress={() => setViewRequestsModal(true)}
            >
              <View style={[styles.activityIconContainer, { backgroundColor: request.status === 'Completed' ? '#E8F5E9' : '#FFEBEE' }]}> 
                {request.icon}
            </View>
            <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>{request.title}</Text>
                <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Status: {request.status}</Text>
                <Text style={[styles.activityTime, darkMode && styles.activityTimeDark]}>{request.time}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
          </View>
          
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Upcoming Events</Text>
          </View>
          
          <View style={[styles.eventCard, darkMode && styles.eventCardDark]}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>18</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, darkMode && styles.eventTitleDark]}>Community Barbecue</Text>
              <Text style={[styles.eventTime, darkMode && styles.eventTimeDark]}>
                <Clock size={14} color={darkMode ? '#FFF' : '#6B7280'} style={{ marginRight: 4 }} /> 
                Saturday, 4:00 PM - 7:00 PM
              </Text>
              <Text style={[styles.eventLocation, darkMode && styles.eventLocationDark]}>Pool Area</Text>
            </View>
          </View>
          
          <View style={[styles.eventCard, darkMode && styles.eventCardDark]}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>25</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, darkMode && styles.eventTitleDark]}>Resident Meeting</Text>
              <Text style={[styles.eventTime, darkMode && styles.eventTimeDark]}>
                <Clock size={14} color={darkMode ? '#FFF' : '#6B7280'} style={{ marginRight: 4 }} /> 
                Saturday, 6:00 PM - 7:00 PM
              </Text>
              <Text style={[styles.eventLocation, darkMode && styles.eventLocationDark]}>Community Hall</Text>
            </View>
          </View>
        </View>
        <ViewRequestsModal 
          visible={viewRequestsModal} 
          onClose={() => setViewRequestsModal(false)} 
          darkMode={darkMode} 
          requests={residentRequests}
        />
        <Modal visible={repairModal} transparent animationType="slide" onRequestClose={() => setRepairModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.addUnitModal, darkMode && styles.addUnitModalDark]}> 
              <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Request Repair</Text>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.dropdownRow}>
                {REPAIR_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.dropdownBtn, repairCategory === cat && styles.dropdownBtnActive]}
                    onPress={() => setRepairCategory(cat)}
                  >
                    <Text style={[styles.dropdownBtnText, repairCategory === cat && styles.dropdownBtnTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, darkMode && styles.inputDark, { minHeight: 60 }]}
                placeholder="Describe the issue..."
                placeholderTextColor={darkMode ? '#888' : '#999'}
                value={repairDescription}
                onChangeText={setRepairDescription}
                multiline
                numberOfLines={4}
              />
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <TouchableOpacity style={[styles.addUnitModalBtn, { backgroundColor: '#E53935', marginRight: 8 }]} onPress={() => setRepairModal(false)}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addUnitModalBtn, { backgroundColor: '#1E88E5' }]}
                  onPress={handleAddResidentRequest}
                  disabled={repairSubmitting || !repairDescription}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{repairSubmitting ? 'Submitting...' : 'Submit'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  
  const renderStaffDashboard = (
    taskStatuses: { [id: string]: 'pending' | 'accepted' | 'rejected' },
    handleAccept: (id: string) => void,
    handleReject: (id: string) => void
  ) => {
    return (
      <>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Maintenance Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {visibleTasks.map(task => (
            <StaffTaskCard
              key={task.id}
              task={task}
              status={taskStatuses[task.id]}
              onAccept={() => handleAccept(task.id)}
              onReject={() => handleReject(task.id)}
              darkMode={darkMode}
            />
          ))}
        </View>
        {/* In Progress Section */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>In Progress</Text>
          </View>
          <View style={[styles.activityCard, darkMode && styles.activityCardDark]}> {/* In Progress Card */}
            <View style={styles.activityIconContainer}>
              <Tool size={20} color="#1E88E5" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, darkMode && styles.activityTitleDark]}>AC Maintenance</Text>
              <Text style={[styles.activityDescription, darkMode && styles.activityDescriptionDark]}>Unit 105 - Started 3 hours ago</Text>
              <View style={[styles.progressBar, darkMode && styles.progressBarDark]}>
                <View style={[styles.progressFill, { width: '60%' }, darkMode && styles.progressFillDark]} />
              </View>
            </View>
            <TouchableOpacity style={[styles.completeButton, darkMode && styles.completeButtonDark]}>
              <Text style={[styles.completeButtonText, darkMode && styles.completeButtonTextDark]}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Today's Schedule Section */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>Today's Schedule</Text>
          </View>
          {/* Show accepted tasks first */}
          {acceptedTasks.map(task => (
            <View key={task.id} style={[styles.scheduleCard, darkMode && styles.scheduleCardDark]}>
              <Text style={[styles.scheduleTime, darkMode && styles.scheduleTimeDark]}>ASAP</Text>
              <View style={[styles.scheduleDivider, darkMode && styles.scheduleDividerDark]} />
              <View style={styles.scheduleContent}>
                <Text style={[styles.scheduleTitle, darkMode && styles.scheduleTitleDark]}>{task.title}</Text>
                <Text style={[styles.scheduleDescription, darkMode && styles.scheduleDescriptionDark]}>{task.location}</Text>
                <View style={[styles.taskStatus, { backgroundColor: PRIORITY_COLORS[task.priority] + '22' }, darkMode && styles.taskStatusDark]}>
                  <Text style={[styles.taskStatusText, { color: PRIORITY_COLORS[task.priority] }, darkMode && styles.taskStatusTextDark]}>{task.priority} Priority</Text>
                </View>
              </View>
            </View>
          ))}
          {/* Show regular scheduled tasks */}
          <View style={[styles.scheduleCard, darkMode && styles.scheduleCardDark]}>
            <Text style={[styles.scheduleTime, darkMode && styles.scheduleTimeDark]}>10:00 AM</Text>
            <View style={[styles.scheduleDivider, darkMode && styles.scheduleDividerDark]} />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, darkMode && styles.scheduleTitleDark]}>Pool Maintenance</Text>
              <Text style={[styles.scheduleDescription, darkMode && styles.scheduleDescriptionDark]}>Regular cleaning and chemical check</Text>
            </View>
          </View>
          <View style={[styles.scheduleCard, darkMode && styles.scheduleCardDark]}>
            <Text style={[styles.scheduleTime, darkMode && styles.scheduleTimeDark]}>2:00 PM</Text>
            <View style={[styles.scheduleDivider, darkMode && styles.scheduleDividerDark]} />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, darkMode && styles.scheduleTitleDark]}>Package Delivery</Text>
              <Text style={[styles.scheduleDescription, darkMode && styles.scheduleDescriptionDark]}>Distribute packages to residents</Text>
            </View>
          </View>
          <View style={[styles.scheduleCard, darkMode && styles.scheduleCardDark]}>
            <Text style={[styles.scheduleTime, darkMode && styles.scheduleTimeDark]}>4:00 PM</Text>
            <View style={[styles.scheduleDivider, darkMode && styles.scheduleDividerDark]} />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, darkMode && styles.scheduleTitleDark]}>Grounds Inspection</Text>
              <Text style={[styles.scheduleDescription, darkMode && styles.scheduleDescriptionDark]}>Check landscaping and common areas</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  // Resident repair requests state
  const [residentRequests, setResidentRequests] = React.useState<ResidentRequest[]>([
    {
      id: '1',
      title: 'Kitchen Sink Repair',
      status: 'In Progress',
      time: 'Submitted 2 days ago',
      icon: <Tool size={20} color="#E53935" />,
      description: 'Leaking faucet in kitchen sink, water pooling under cabinet'
    },
    {
      id: '2',
      title: 'AC Maintenance',
      status: 'Completed',
      time: 'Completed 1 week ago',
      icon: <Tool size={20} color="#4CAF50" />,
      description: 'Annual AC service and filter replacement'
    }
  ]);

  // Handler to add a new repair request
  const handleAddResidentRequest = () => {
    setRepairSubmitting(true);
    setTimeout(() => {
      setResidentRequests(prev => [
        {
          id: Date.now().toString(),
          title: repairCategory + ' Repair',
          description: repairDescription,
          status: 'In Progress',
          time: 'Just now',
          icon: <Tool size={20} color="#E53935" />,
        },
        ...prev
      ]);
      setRepairSubmitting(false);
      setRepairModal(false);
      setRepairCategory(REPAIR_CATEGORIES[0]);
      setRepairDescription('');
    }, 900);
  };

  // Resident repair request modal state (move these up for scope)
  const [repairModal, setRepairModal] = React.useState(false);
  const [repairCategory, setRepairCategory] = React.useState(REPAIR_CATEGORIES[0]);
  const [repairDescription, setRepairDescription] = React.useState('');
  const [repairSubmitting, setRepairSubmitting] = React.useState(false);

  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      title: 'New Maintenance Request',
      body: 'Unit 304 - Leaking Faucet',
      icon: <AlertCircle size={20} color="#E53935" />,
      time: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Package Delivered',
      body: 'Unit 201 - Amazon',
      icon: <Package size={20} color="#1E88E5" />,
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'New Resident',
      body: 'Unit 105 - John Smith',
      icon: <Users size={20} color="#4CAF50" />,
      time: '2 days ago',
      read: false
    }
  ]);
  const [notificationCount, setNotificationCount] = React.useState(3);

  const handleIssueReported = (issueType: string, description: string) => {
    const newNotification = {
      id: Date.now().toString(),
      title: 'Issue Reported',
      body: `${issueType} Issue: ${description}`,
      icon: <AlertTriangle size={20} color="#E53935" />,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setNotificationCount(prev => prev + 1);

    // Also add to residentRequests
    setResidentRequests(prev => [
      {
        id: Date.now().toString(),
        title: `${issueType} Issue`,
        description,
        status: 'In Progress',
        time: 'Just now',
        icon: <AlertTriangle size={20} color="#E53935" />,
      },
      ...prev
    ]);
  };

  const handleBookAmenity = (amenity: string, date: string, time: string) => {
    setResidentRequests(prev => [
      {
        id: Date.now().toString(),
        title: `Amenity Booking: ${amenity}`,
        description: `Booked for ${date} at ${time}`,
        status: 'In Progress',
        time: 'Just now',
        icon: <CalendarIcon size={20} color="#1E88E5" />,
      },
      ...prev
    ]);
  };

  const handleInviteVisitor = (name: string, visitTime: string, purpose: string) => {
    setResidentRequests(prev => [
      {
        id: Date.now().toString(),
        title: `Visitor: ${name}`,
        description: `Visit at ${visitTime}. Purpose: ${purpose}`,
        status: 'In Progress',
        time: 'Just now',
        icon: <Users size={20} color="#1E88E5" />,
      },
      ...prev
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar style="auto" />
      <View style={[styles.header, darkMode && styles.headerDark]}>
        <View>
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>
            Welcome, {user?.name || 'User'}
          </Text>
          <Text style={[styles.headerSubtitle, darkMode && styles.headerSubtitleDark]}>
            {userRole === 'admin' ? 'Administrator' : userRole === 'staff' ? 'Staff Member' : 'Resident - Unit 304'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
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
      
      <ScrollView 
        style={[styles.scrollView, darkMode && styles.scrollViewDark]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userRole === 'admin' && renderAdminDashboard()}
        {userRole === 'resident' && renderResidentDashboard()}
        {userRole === 'staff' && renderStaffDashboard(taskStatuses, handleAccept, handleReject)}
      </ScrollView>

      <AnnouncementModal visible={announcementModal} onClose={() => setAnnouncementModal(false)} darkMode={darkMode} />
      <MaintenanceModal visible={maintenanceModal} onClose={() => setMaintenanceModal(false)} darkMode={darkMode} />
      <ReportsModal visible={reportsModal} onClose={() => setReportsModal(false)} darkMode={darkMode} />
      <ScheduleModal 
        visible={scheduleModal} 
        onClose={() => setScheduleModal(false)} 
        darkMode={darkMode}
        onSave={handleActivitySave}
      />
      <InviteVisitorModal visible={inviteVisitorModal} onClose={() => setInviteVisitorModal(false)} darkMode={darkMode} onInviteVisitor={handleInviteVisitor} />
      <BookAmenityModal visible={bookAmenityModal} onClose={() => setBookAmenityModal(false)} darkMode={darkMode} onBookAmenity={handleBookAmenity} />
      <ReportIssueModal 
        visible={reportIssueModal} 
        onClose={() => setReportIssueModal(false)} 
        darkMode={darkMode}
        onIssueReported={handleIssueReported}
      />
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
  headerDark: {
    backgroundColor: '#121212',
    borderBottomColor: '#222',
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
  eventCardDark: {
    backgroundColor: '#222',
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
  eventTitleDark: {
    color: '#FFF',
  },
  eventTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTimeDark: {
    color: '#FFF',
  },
  eventLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  eventLocationDark: {
    color: '#FFF',
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
  maintenanceModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  maintSummaryCard: {
    minWidth: 110,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  maintSummaryCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: '#1E88E5',
    marginTop: 4,
  },
  maintSummaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  maintRecentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  maintRecentCardDark: {
    backgroundColor: '#222',
  },
  maintRecentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#1E88E5',
  },
  maintRecentTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  reportsModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  reportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  reportActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#1E88E5',
  },
  reportTypesList: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  reportTypeItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  exportBtnActive: {
    backgroundColor: '#1E88E5',
  },
  exportBtnText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  exportBtnTextActive: {
    color: '#FFF',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  dateFilterBtnActive: {
    backgroundColor: '#1E88E5',
  },
  dateFilterText: {
    color: '#1E88E5',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  dateFilterTextActive: {
    color: '#FFF',
  },
  lastUpdatedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 18,
    textAlign: 'center',
  },
  scheduleModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  scheduleModalContent: {
    marginTop: 16,
  },
  scheduleField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  scheduleFieldDark: {
    backgroundColor: '#333',
  },
  scheduleFieldText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E88E5',
  },
  scheduleFieldTextDark: {
    color: '#FFF',
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E88E5',
    marginBottom: 8,
  },
  noteLabelDark: {
    color: '#FFF',
  },
  noteInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteInputDark: {
    backgroundColor: '#333',
    color: '#FFF',
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  cancelButtonDark: {
    borderColor: '#FFF',
  },
  saveButton: {
    backgroundColor: '#1E88E5',
  },
  scheduleButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#1E88E5',
  },
  cancelButtonTextDark: {
    color: '#FFF',
  },
  saveButtonText: {
    color: '#FFF',
  },
  profileModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  profileContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatarText: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
  },
  profileInfo: {
    width: '100%',
    marginBottom: 24,
  },
  profileField: {
    marginBottom: 16,
  },
  profileLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileLabelDark: {
    color: '#9CA3AF',
  },
  profileValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
  },
  profileValueDark: {
    color: '#FFF',
  },
  editProfileButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  editProfileButtonDark: {
    backgroundColor: '#2563EB',
  },
  editProfileButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingsItemDark: {
    backgroundColor: '#333',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E88E5',
  },
  settingsTextDark: {
    color: '#FFF',
  },
  requestCard: {
    flexDirection: 'row',
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
  requestCardDark: {
    backgroundColor: '#333',
  },
  requestIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestContent: {
    flex: 1,
  },
  requestTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
  },
  requestTitleDark: {
    color: '#FFF',
  },
  requestStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 2,
  },
  requestDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  requestDescriptionDark: {
    color: '#FFF',
  },
  requestTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  requestTimeDark: {
    color: '#FFF',
  },
  taskCardDark: {
    backgroundColor: '#222',
  },
  addUnitModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  addUnitModalDark: {
    backgroundColor: '#333',
  },
  addUnitModalBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  taskTitleDark: { color: '#FFF' },
  taskLocationDark: { color: '#CCC' },
  taskTimeDark: { color: '#AAA' },
  taskStatusDark: { backgroundColor: '#333' },
  taskStatusTextDark: { color: '#FFF' },
  progressBarDark: { backgroundColor: '#333' },
  progressFillDark: { backgroundColor: '#1E88E5' },
  completeButtonDark: { backgroundColor: '#333' },
  completeButtonTextDark: { color: '#FFF' },
  scheduleCardDark: { backgroundColor: '#222' },
  scheduleTimeDark: { color: '#81b0ff' },
  scheduleTitleDark: { color: '#FFF' },
  scheduleDescriptionDark: { color: '#CCC' },
  scheduleDividerDark: { backgroundColor: '#333' },
});