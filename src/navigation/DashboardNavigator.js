import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import UserManagementScreen from '../screens/dashboard/UserManagementScreen'; // Import UserManagementScreen
import ClientsScreen from '../screens/dashboard/ClientsScreen';
import ClientDetailScreen from '../screens/dashboard/ClientDetailScreen';
import AddClientScreen from '../screens/dashboard/AddClientScreen';
import EditClientScreen from '../screens/dashboard/EditClientScreen'; // Import EditClientScreen
import ReportsScreen from '../screens/dashboard/ReportsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Keep one Stack definition

// Stack for the "Home" tab to include Dashboard and UserManagement
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardHome" // Renamed to avoid conflict if 'Dashboard' is used elsewhere
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'Gestion des Utilisateurs', // Header title for this screen
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white, // Ensure theme consistency
          headerBackTitleVisible: false,
        }}
      />
      {/* Add other screens navigable from DashboardScreen here if any */}
    </Stack.Navigator>
  );
}

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
          title: 'Détails du Client', // Corrected French
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AddClient" 
        component={AddClientScreen}
        options={{ 
          title: 'Nouveau Client',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="EditClient"
        component={EditClientScreen}
        options={{
          title: 'Modifier Client', // Header title for this screen
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerBackTitleVisible: false,
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
        component={HomeStack} // Use HomeStack here
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