import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ClientsScreen from '../screens/dashboard/ClientsScreen';
import ClientDetailScreen from '../screens/dashboard/ClientDetailScreen';
import AddClientScreen from '../screens/dashboard/AddClientScreen';
import ReportsScreen from '../screens/dashboard/ReportsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ClientsList" 
        component={ClientsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ClientDetail" 
        component={ClientDetailScreen}
        options={{ 
          title: 'Detalle del Cliente',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen 
        name="AddClient" 
        component={AddClientScreen}
        options={{ 
          title: 'Nuevo Cliente',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
}

export default function DashboardNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'dashboard';
          } else if (route.name === 'Clients') {
            iconName = 'people';
          } else if (route.name === 'Reports') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Clients" 
        component={ClientsStack}
        options={{ tabBarLabel: 'Clientes' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ tabBarLabel: 'Reportes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}