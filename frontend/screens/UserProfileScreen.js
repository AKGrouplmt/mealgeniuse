import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { 
  moderateScale, 
  verticalScale, 
  fonts, 
  spacing, 
  width,
  height,
  platformPadding,
  isSmallDevice,
  isLargeDevice
} from '../utils/responsive';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const UserProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'goals'

  // User Profile Data
  const [profile, setProfile] = useState({
    name: 'Aarya',
    age: '21',
    height: '175',
    weight: '65',
    gender: 'male',
    activityLevel: 'Moderately Active',
    goal: 'Maintain Weight'
  });

  // Nutrition Goals
  const [goals, setGoals] = useState({
    calories: '1800',
    protein: '80',
    carbs: '250',
    fat: '60',
    water: '2.5'
  });

  const activityLevels = [
    'Sedentary',
    'Lightly Active', 
    'Moderately Active',
    'Very Active',
    'Extremely Active'
  ];

  const fitnessGoals = [
    'Lose Weight',
    'Gain Muscle',
    'Maintain Weight',
    'Improve Health'
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // In real app, get from backend
      // const response = await axios.get(`${API_BASE_URL}/auth/profile/user123`);
      
      // Simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // In real app, save to backend
      // await axios.put(`${API_BASE_URL}/auth/profile/user123`, profile);
      
      setTimeout(() => {
        Alert.alert('Success', 'Profile updated successfully!');
        setSaving(false);
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleSaveGoals = async () => {
    setSaving(true);
    try {
      // In real app, save to backend
      // await axios.put(`${API_BASE_URL}/progress/goals/user123`, goals);
      
      setTimeout(() => {
        Alert.alert('Success', 'Goals updated successfully!');
        setSaving(false);
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goals');
      setSaving(false);
    }
  };

  const calculateGoals = () => {
    // Basic calorie calculation based on profile
    const weight = parseFloat(profile.weight) || 70;
    const height = parseFloat(profile.height) || 175;
    const age = parseFloat(profile.age) || 30;
    
    // Simple BMR calculation
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    if (profile.gender === 'Female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    const multipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
      'Extremely Active': 1.9
    };

    let maintenanceCalories = bmr * (multipliers[profile.activityLevel] || 1.55);

    // Adjust based on goal
    if (profile.goal === 'Lose Weight') {
      maintenanceCalories -= 500;
    } else if (profile.goal === 'Gain Muscle') {
      maintenanceCalories += 300;
    }

    const calculatedGoals = {
      calories: Math.round(maintenanceCalories).toString(),
      protein: Math.round((maintenanceCalories * 0.3) / 4).toString(), // 30% from protein
      carbs: Math.round((maintenanceCalories * 0.4) / 4).toString(), // 40% from carbs
      fat: Math.round((maintenanceCalories * 0.3) / 9).toString(), // 30% from fat
      water: '2.5'
    };

    setGoals(calculatedGoals);
    Alert.alert('Goals Calculated', 'Your nutrition goals have been calculated based on your profile!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8E6CF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Personal Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>
            Nutrition Goals
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'profile' ? (
          /* Personal Info Tab */
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={profile.name}
                  onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.age}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, age: text }))}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderButtons}>
                    <TouchableOpacity 
                      style={[
                        styles.genderButton,
                        profile.gender === 'Male' && styles.genderButtonActive
                      ]}
                      onPress={() => setProfile(prev => ({ ...prev, gender: 'Male' }))}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        profile.gender === 'Male' && styles.genderButtonTextActive
                      ]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.genderButton,
                        profile.gender === 'Female' && styles.genderButtonActive
                      ]}
                      onPress={() => setProfile(prev => ({ ...prev, gender: 'Female' }))}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        profile.gender === 'Female' && styles.genderButtonTextActive
                      ]}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.height}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, height: text }))}
                    placeholder="Height"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.weight}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, weight: text }))}
                    placeholder="Weight"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Activity Level</Text>
                <View style={styles.activityButtons}>
                  {activityLevels.map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.activityButton,
                        profile.activityLevel === level && styles.activityButtonActive
                      ]}
                      onPress={() => setProfile(prev => ({ ...prev, activityLevel: level }))}
                    >
                      <Text style={[
                        styles.activityButtonText,
                        profile.activityLevel === level && styles.activityButtonTextActive
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fitness Goal</Text>
                <View style={styles.goalButtons}>
                  {fitnessGoals.map(goal => (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.goalButton,
                        profile.goal === goal && styles.goalButtonActive
                      ]}
                      onPress={() => setProfile(prev => ({ ...prev, goal: goal }))}
                    >
                      <Text style={[
                        styles.goalButtonText,
                        profile.goal === goal && styles.goalButtonTextActive
                      ]}>
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.calculateButton}
                onPress={calculateGoals}
              >
                <LinearGradient
                  colors={['#A8E6CF', '#A0E7E5']}
                  style={styles.calculateButtonGradient}
                >
                  <Ionicons name="calculator" size={20} color="#333" />
                  <Text style={styles.calculateButtonText}>Calculate Nutrition Goals</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                )}
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ) : (
          /* Nutrition Goals Tab */
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Daily Nutrition Goals</Text>
              <Text style={styles.sectionSubtitle}>
                Set your daily targets for optimal nutrition
              </Text>

              <View style={styles.goalInputGroup}>
                <Text style={styles.label}>Calories (kcal)</Text>
                <TextInput
                  style={styles.goalInput}
                  value={goals.calories}
                  onChangeText={(text) => setGoals(prev => ({ ...prev, calories: text }))}
                  placeholder="2000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.goalInputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Protein (g)</Text>
                  <TextInput
                    style={styles.goalInput}
                    value={goals.protein}
                    onChangeText={(text) => setGoals(prev => ({ ...prev, protein: text }))}
                    placeholder="50"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.goalInputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Carbs (g)</Text>
                  <TextInput
                    style={styles.goalInput}
                    value={goals.carbs}
                    onChangeText={(text) => setGoals(prev => ({ ...prev, carbs: text }))}
                    placeholder="250"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.goalInputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Fat (g)</Text>
                  <TextInput
                    style={styles.goalInput}
                    value={goals.fat}
                    onChangeText={(text) => setGoals(prev => ({ ...prev, fat: text }))}
                    placeholder="65"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.goalInputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Water (L)</Text>
                  <TextInput
                    style={styles.goalInput}
                    value={goals.water}
                    onChangeText={(text) => setGoals(prev => ({ ...prev, water: text }))}
                    placeholder="2.5"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.goalsSummary}>
                <Text style={styles.summaryTitle}>Daily Summary</Text>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Calories:</Text>
                  <Text style={styles.summaryValue}>{goals.calories} kcal</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Protein:</Text>
                  <Text style={styles.summaryValue}>{goals.protein}g</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Carbs:</Text>
                  <Text style={styles.summaryValue}>{goals.carbs}g</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Fat:</Text>
                  <Text style={styles.summaryValue}>{goals.fat}g</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Water:</Text>
                  <Text style={styles.summaryValue}>{goals.water}L</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveGoals}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Goals</Text>
                )}
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#A8E6CF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#A8E6CF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  goalInputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  goalInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  genderButtons: {
    flexDirection: 'row',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginRight: 8,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#A8E6CF',
    borderColor: '#A8E6CF',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  activityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  activityButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    margin: 4,
    alignItems: 'center',
  },
  activityButtonActive: {
    backgroundColor: '#A8E6CF',
    borderColor: '#A8E6CF',
  },
  activityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activityButtonTextActive: {
    color: '#fff',
  },
  goalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  goalButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    margin: 4,
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: '#A8E6CF',
    borderColor: '#A8E6CF',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  calculateButton: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  calculateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  goalsSummary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default UserProfileScreen;