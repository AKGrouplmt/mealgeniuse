import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import GenerateRecipeScreen from '../screens/GenerateRecipeScreen';
import MealPlanScreen from '../screens/MealPlanScreen';
import HealthTrackerScreen from '../screens/HealthTrackerScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#A8E6CF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="GenerateTab" 
        component={GenerateRecipeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "restaurant" : "restaurant-outline"} 
              size={size} 
              color={color} 
            />
          ),
          tabBarLabel: 'Recipes',
        }}
      />
      <Tab.Screen 
        name="MealPlanTab" 
        component={MealPlanScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={size} 
              color={color} 
            />
          ),
          tabBarLabel: 'Meal Plan',
        }}
      />
      <Tab.Screen 
        name="HealthTab" 
        component={HealthTrackerScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "fitness" : "fitness-outline"} 
              size={size} 
              color={color} 
            />
          ),
          tabBarLabel: 'Health',
        }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "chatbubble" : "chatbubble-outline"} 
              size={size} 
              color={color} 
            />
          ),
          tabBarLabel: 'AI Chat',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;