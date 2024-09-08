import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Link, Tabs } from 'expo-router';
import { Pressable, TouchableOpacity, View, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/context/auth';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function FontAwesomeIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function MaterialIconsIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {signOut} = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIconsIcon name="space-dashboard" color={color} />,
          
        }}
      />

      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color }) => <MaterialIconsIcon name="class" color={color} />,
        }}
      />

      <Tabs.Screen
        name="attendence"
        options={{
          title: 'Student Attendence',
          tabBarIcon: ({ color }) => <MaterialIconsIcon name="co-present" color={color} />,
          
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIconsIcon name="settings" color={color} />,
          // headerBackgroundContainerStyle: {borderBottomColor: "green", borderBottomWidth: 2},
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={signOut} className='mr-4 px-2 py-1 bg-primary rounded-lg'>
                <Text className='text-btn_title font-semibold text-white'>Logout</Text>
              </TouchableOpacity>
          </View>
          ),
        }}
      />

    </Tabs>
  );
}
