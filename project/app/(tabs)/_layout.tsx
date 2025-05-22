import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { 
  Chrome as Home, 
  Building2, 
  PenTool as Tool, 
  CreditCard, 
  Users, 
  Calendar, 
  Settings 
} from 'lucide-react-native';

export default function TabLayout() {
  const { userRole } = useAuth();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
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
          title: 'Residents',
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
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});