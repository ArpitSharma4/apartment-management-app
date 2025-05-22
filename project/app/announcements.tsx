import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Switch,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, ArrowLeft, Megaphone } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

// Announcement type
interface Announcement {
  id: string;
  title: string;
  body: string;
  type: string;
  audience: string;
  priority: string;
  scheduleDate: Date;
  visibilityDays: string;
  push: boolean;
  createdAt: Date;
}

export default function AnnouncementsScreen() {
  const { darkMode } = useTheme();
  const router = useRouter();
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
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

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

  // Save announcement and reset form
  const handlePreview = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      body,
      type,
      audience,
      priority,
      scheduleDate,
      visibilityDays,
      push,
      createdAt: new Date(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setTitle('');
    setBody('');
    setType('General Notice');
    setAudience('All Residents');
    setPriority('Low');
    setScheduleLater(false);
    setScheduleDate(new Date());
    setVisibilityDays('3');
    setPush(true);
    setPreview(false);
  };

  return (
    <View style={[styles.page, darkMode && styles.pageDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={darkMode ? '#FFF' : '#1E88E5'} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Megaphone size={22} color={darkMode ? '#FFF' : '#1E88E5'} style={{ marginRight: 6 }} />
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>Announcements</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, darkMode && styles.cardDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>📝 Create Announcement</Text>
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
          <TouchableOpacity style={styles.previewBtn} onPress={handlePreview}>
            <Text style={styles.previewBtnText}>Preview</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, darkMode && styles.cardDark, { marginTop: 24 }]}> 
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>📋 Past Announcements Log</Text>
          {announcements.length === 0 ? (
            <View style={styles.announcementLogStub}>
              <Text style={{ color: darkMode ? '#FFF' : '#333', textAlign: 'center' }}>
                (Demo) No announcements yet. This section will show all past announcements with filters, edit/delete, and engagement insights.
              </Text>
            </View>
          ) : (
            announcements.map(a => (
              <View key={a.id} style={[styles.announcementItem, darkMode && styles.announcementItemDark]}>
                <Text style={[styles.announcementTitle, darkMode && styles.announcementTitleDark]}>{a.title}</Text>
                <Text style={[styles.announcementMeta, darkMode && styles.announcementMetaDark]}>
                  {a.type} | {a.audience} | {a.priority} | {a.scheduleDate.toLocaleString()} | {a.visibilityDays} days
                </Text>
                <Text style={[styles.announcementBody, darkMode && styles.announcementBodyDark]}>{a.body}</Text>
                <Text style={[styles.announcementMeta, darkMode && styles.announcementMetaDark]}>Created: {a.createdAt.toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  pageDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E88E5',
  },
  headerTitleDark: {
    color: '#FFF',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#222',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E88E5',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#FFF',
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
  announcementItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  announcementItemDark: {
    backgroundColor: '#222',
  },
  announcementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
    marginBottom: 2,
  },
  announcementTitleDark: {
    color: '#FFF',
  },
  announcementMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  announcementMetaDark: {
    color: '#BDBDBD',
  },
  announcementBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  announcementBodyDark: {
    color: '#FFF',
  },
}); 