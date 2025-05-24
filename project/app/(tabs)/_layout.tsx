import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { 
  Chrome as Home, 
  Building2, 
  PenTool as Tool, 
  CreditCard, 
  Users, 
  Calendar, 
  Settings 
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { userRole } = useAuth();
  const { darkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: darkMode ? '#FFFFFF' : '#1E88E5',
        tabBarInactiveTintColor: darkMode ? '#666666' : '#9CA3AF',
        tabBarStyle: [styles.tabBar, darkMode && styles.tabBarDark],
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'HomeHarbor',
          tabBarLabel: 'HomeHarbor',
          tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color, size }) => <Tool size={size} color={color} />, 
        }}
      />
      {userRole === 'admin' || userRole === 'resident' ? (
        <Tabs.Screen
          name="billing"
          options={{
            title: 'Billing',
            tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />, 
          }}
        />
      ) : null}
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="amenities"
        options={{
          title: 'Amenities',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />, 
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />, 
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    height: 64,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tabBarDark: {
    backgroundColor: '#121212',
    borderTopColor: '#333333',
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  taskTitleDark: { color: '#FFF' },
  taskLocationDark: { color: '#CCC' },
  taskTimeDark: { color: '#AAA' },
  taskStatusDark: { backgroundColor: '#333' },
  taskStatusTextDark: { color: '#FFF' },
  scheduleCardDark: { backgroundColor: '#222' },
  scheduleTimeDark: { color: '#81b0ff' },
  scheduleTitleDark: { color: '#FFF' },
  scheduleDescriptionDark: { color: '#CCC' },
  scheduleDividerDark: { backgroundColor: '#333' },
});