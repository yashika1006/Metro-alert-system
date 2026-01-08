import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2ecc71', // Green for active (changed from blue)
        tabBarInactiveTintColor: '#95a5a6', // Gray for inactive
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '🚇' : '🚈'} 
            </Text>
          ),
        }}
      />
      
      {/* Caregivers Tab */}
      <Tabs.Screen
        name="caregivers"
        options={{
          title: 'Caregivers',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '👥' : '👤'} 
            </Text>
          ),
        }}
      />
      
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '⚙️' : '🔧'} 
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}