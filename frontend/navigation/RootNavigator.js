import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import navigators
import AppNavigator from './AppNavigator';

// Import all screens for stack navigation
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash"  // Changed from "App" to "Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' }
      }}
    >
      {/* Splash Screen - First screen users see */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      
      {/* Auth Flow Screens */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      
      {/* Main App with Tab Navigation */}
      <Stack.Screen name="App" component={AppNavigator} />
      
      {/* Modal Screens (accessible from anywhere) */}
      <Stack.Screen 
        name="RecipeDetails" 
        component={RecipeDetailsScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;