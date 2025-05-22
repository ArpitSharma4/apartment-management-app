import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, AlertCircle, PenTool as Tool, Users, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  time: string;
  read: boolean;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Maintenance Request', body: 'Unit 304 - Leaking Faucet', icon: <Tool size={20} color="#E53935" />, time: '10 minutes ago', read: false },
  { id: '2', title: 'Package Delivered', body: 'Unit 201 - Amazon', icon: <Bell size={20} color="#1E88E5" />, time: '1 hour ago', read: false },
  { id: '3', title: 'New Resident', body: 'Unit 105 - John Smith', icon: <Users size={20} color="#4CAF50" />, time: '2 days ago', read: false },
  { id: '4', title: 'Alert', body: 'Fire drill scheduled for June 15th', icon: <AlertCircle size={20} color="#FFC107" />, time: '3 days ago', read: false },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  useEffect(() => {
    // Mark all as read when page is opened
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  }, []);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={darkMode ? '#FFF' : '#1E88E5'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, darkMode && styles.notificationCardDark, item.read && styles.notificationCardRead]}> 
            <View style={[styles.iconContainer, { backgroundColor: item.title.includes('Issue') ? '#FFEBEE' : '#F3F4F6' }]}>
              {item.icon}
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, darkMode && styles.titleDark]}>{item.title}</Text>
              <Text style={[styles.body, darkMode && styles.bodyDark]}>{item.body}</Text>
              <Text style={[styles.time, darkMode && styles.timeDark]}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: darkMode ? '#FFF' : '#333', marginTop: 40 }}>No notifications</Text>}
      />
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
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E88E5',
  },
  headerTitleDark: {
    color: '#FFF',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  notificationCardDark: {
    backgroundColor: '#222',
  },
  notificationCardRead: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E88E5',
  },
  titleDark: {
    color: '#FFF',
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  bodyDark: {
    color: '#FFF',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  timeDark: {
    color: '#FFF',
  },
}); 