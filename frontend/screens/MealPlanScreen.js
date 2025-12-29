import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Platform
} from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import { 
  moderateScale, 
  verticalScale, 
  fonts, 
  spacing, 
  isLargeDevice,
  isSmallDevice,
  width,
  height,
  platformPadding 
} from '../utils/responsive';

// Use different URLs based on platform
const getAPIBaseURL = () => {
  // For Android emulator
  if (Platform.OS === 'android') {
    return 'http://10.96.20.123:5000/api';

  }
  // For iOS simulator
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getAPIBaseURL();

const MealPlanScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatingRecipe, setGeneratingRecipe] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const mealIdeas = {
    'Breakfast': ['Oatmeal with Berries', 'Avocado Toast', 'Greek Yogurt Bowl', 'Scrambled Eggs', 'Smoothie Bowl'],
    'Lunch': ['Quinoa Salad', 'Chicken Wrap', 'Vegetable Soup', 'Buddha Bowl', 'Turkey Sandwich'],
    'Dinner': ['Grilled Salmon', 'Vegetable Stir Fry', 'Chicken Curry', 'Pasta Primavera', 'Beef Tacos'],
    'Snack': ['Apple with Peanut Butter', 'Mixed Nuts', 'Protein Bar', 'Carrot Sticks', 'Greek Yogurt']
  };

  // Monitor network connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        setNetworkError(false);
        // Check backend when connection is restored
        checkBackendAvailability();
      }
    });

    // Check backend availability on component mount
    checkBackendAvailability();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadMealPlan();
  }, [selectedDate]);

  // Check if backend server is available
const checkBackendAvailability = async () => {
  if (!isConnected) {
    setBackendAvailable(false);
    return;
  }

  try {
    console.log('🔍 Checking backend availability...');
    const response = await axios.get(`${API_BASE_URL}/health`, { 
      timeout: 5000 
    });
    
    if (response.data && response.data.status === 'OK') {
      setBackendAvailable(true);
      console.log('✅ Backend server is available and healthy');
    } else {
      setBackendAvailable(false);
      console.log('❌ Backend responded but with unexpected data');
    }
  } catch (error) {
    setBackendAvailable(false);
    console.log('❌ Backend server is not available:', error.message);
    console.log('💡 Make sure backend is running on port 5000');
  }
};

  // Network connection utilities
  const checkNetworkConnection = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const ensureNetworkConnection = async () => {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      setNetworkError(true);
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.'
      );
      throw new Error('NO_INTERNET');
    }
    setNetworkError(false);
    return true;
  };

  // Enhanced API call with retry logic
  const makeAPIRequest = async (endpoint, data = null, retries = 2) => {
    try {
      await ensureNetworkConnection();
      
      // If backend is not available, skip API call
      if (!backendAvailable) {
        throw new Error('BACKEND_UNAVAILABLE');
      }

      const config = {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = data 
        ? await axios.post(`${API_BASE_URL}${endpoint}`, data, config)
        : await axios.get(`${API_BASE_URL}${endpoint}`, config);

      return response.data;
    } catch (error) {
      console.log(`API Request failed: ${error.message}`);
      throw error;
    }
  };

  const loadMealPlan = async () => {
    try {
      setLoading(true);
      
      // Check backend availability when loading meal plan
      await checkBackendAvailability();
      
      const emptyMealPlan = {
        _id: 'current-plan',
        date: selectedDate,
        meals: mealTypes.map(mealType => ({
          mealType,
          recipeId: null,
          consumed: false,
          generating: false
        }))
      };

      setMealPlan(emptyMealPlan);
      setLoading(false);

    } catch (error) {
      console.error('Error loading meal plan:', error);
      setLoading(false);
      if (error.message === 'NO_INTERNET') {
        setNetworkError(true);
      }
    }
  };

  // Enhanced AI Recipe Generation with Smart Fallbacks
  const generateAIRecipe = async (mealType) => {
    if (!isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
      return;
    }

    setGeneratingRecipe(mealType);
    
    try {
      const ideas = mealIdeas[mealType];
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
      
      console.log(`🤖 Attempting to generate AI recipe for: ${mealType} - ${randomIdea}`);

      // Try to use AI backend first
      try {
        const response = await makeAPIRequest('/recipes/generate-from-name', {
          recipeName: `${randomIdea}`,
          dietaryPreferences: [],
          servings: 1
        });

        if (response.success && response.recipe) {
          const aiRecipe = response.recipe;
          
          const updatedMeals = mealPlan.meals.map(meal => 
            meal.mealType === mealType 
              ? { ...meal, recipeId: aiRecipe, generating: false }
              : meal
          );

          setMealPlan({
            ...mealPlan,
            meals: updatedMeals
          });

          Alert.alert('Success!', `AI created "${aiRecipe.name}" for ${mealType}`);
          return;
        }
      } catch (apiError) {
        console.log('AI generation failed, using enhanced fallback:', apiError.message);
        // Continue to fallback recipe
      }

      // If AI generation fails, use enhanced fallback recipe
      throw new Error('AI_GENERATION_FAILED');

    } catch (error) {
      console.error('❌ Error in recipe generation:', error);
      
      // Use enhanced fallback recipe
      const fallbackRecipe = createEnhancedFallbackRecipe(mealType);
      const updatedMeals = mealPlan.meals.map(meal => 
        meal.mealType === mealType 
          ? { ...meal, recipeId: fallbackRecipe, generating: false }
          : meal
      );

      setMealPlan({
        ...mealPlan,
        meals: updatedMeals
      });

      // Show appropriate message
      if (!backendAvailable) {
        Alert.alert(
          'Demo Mode', 
          `Created "${fallbackRecipe.name}" for ${mealType}. Start backend server for AI recipes.`
        );
      } else {
        Alert.alert('Demo Recipe', `Created "${fallbackRecipe.name}" for ${mealType}`);
      }
    } finally {
      setGeneratingRecipe(null);
    }
  };

  // Enhanced fallback recipes with more variety
  const createEnhancedFallbackRecipe = (mealType) => {
    const recipeTemplates = {
      'Breakfast': [
        {
          name: 'Energy Breakfast Bowl',
          description: 'A nutritious bowl packed with proteins and fibers to start your day energized.',
          ingredients: [
            { name: 'Rolled oats', quantity: '1/2', unit: 'cup' },
            { name: 'Almond milk', quantity: '1', unit: 'cup' },
            { name: 'Mixed berries', quantity: '1/2', unit: 'cup' },
            { name: 'Almonds', quantity: '2', unit: 'tbsp' },
            { name: 'Chia seeds', quantity: '1', unit: 'tbsp' },
            { name: 'Honey', quantity: '1', unit: 'tsp' }
          ],
          instructions: [
            'Combine oats and almond milk in a bowl',
            'Microwave for 2 minutes or cook on stove',
            'Top with berries, almonds, and chia seeds',
            'Drizzle with honey and serve warm'
          ],
          prepTime: 5,
          cookTime: 5,
          servings: 1,
          calories: 320,
          protein: 12,
          carbs: 45,
          fat: 10
        },
        {
          name: 'Avocado Toast Deluxe',
          description: 'Creamy avocado on whole grain toast with perfect seasonings.',
          ingredients: [
            { name: 'Whole grain bread', quantity: '2', unit: 'slices' },
            { name: 'Ripe avocado', quantity: '1', unit: 'medium' },
            { name: 'Cherry tomatoes', quantity: '5-6', unit: 'pieces' },
            { name: 'Red pepper flakes', quantity: '1/4', unit: 'tsp' },
            { name: 'Lemon juice', quantity: '1', unit: 'tbsp' },
            { name: 'Salt and pepper', quantity: 'to taste', unit: '' }
          ],
          instructions: [
            'Toast bread until golden brown',
            'Mash avocado with lemon juice, salt, and pepper',
            'Spread avocado mixture on toast',
            'Top with sliced cherry tomatoes',
            'Sprinkle with red pepper flakes and serve'
          ],
          prepTime: 8,
          cookTime: 3,
          servings: 1,
          calories: 280,
          protein: 8,
          carbs: 30,
          fat: 15
        }
      ],
      'Lunch': [
        {
          name: 'Mediterranean Quinoa Bowl',
          description: 'Fresh and flavorful bowl with Mediterranean inspired ingredients.',
          ingredients: [
            { name: 'Quinoa', quantity: '1/2', unit: 'cup' },
            { name: 'Cucumber', quantity: '1/2', unit: 'medium' },
            { name: 'Cherry tomatoes', quantity: '1/2', unit: 'cup' },
            { name: 'Feta cheese', quantity: '1/4', unit: 'cup' },
            { name: 'Kalamata olives', quantity: '5-6', unit: 'pieces' },
            { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
            { name: 'Lemon juice', quantity: '1', unit: 'tbsp' }
          ],
          instructions: [
            'Cook quinoa according to package instructions',
            'Dice cucumber and halve cherry tomatoes',
            'Combine all ingredients in a bowl',
            'Dress with olive oil and lemon juice',
            'Crumble feta cheese on top and serve'
          ],
          prepTime: 10,
          cookTime: 15,
          servings: 1,
          calories: 380,
          protein: 14,
          carbs: 42,
          fat: 18
        }
      ],
      'Dinner': [
        {
          name: 'Herb Roasted Chicken',
          description: 'Juicy chicken roasted with fresh herbs and vegetables.',
          ingredients: [
            { name: 'Chicken breast', quantity: '1', unit: 'large' },
            { name: 'Mixed vegetables', quantity: '2', unit: 'cups' },
            { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
            { name: 'Fresh herbs', quantity: '2', unit: 'tbsp' },
            { name: 'Garlic', quantity: '2', unit: 'cloves' },
            { name: 'Salt and pepper', quantity: 'to taste', unit: '' }
          ],
          instructions: [
            'Preheat oven to 400°F (200°C)',
            'Season chicken with herbs, garlic, salt, and pepper',
            'Toss vegetables with olive oil',
            'Roast for 25-30 minutes until chicken is cooked',
            'Rest for 5 minutes before serving'
          ],
          prepTime: 10,
          cookTime: 30,
          servings: 1,
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 20
        }
      ],
      'Snack': [
        {
          name: 'Energy Protein Balls',
          description: 'No-bake energy balls perfect for a quick snack.',
          ingredients: [
            { name: 'Oats', quantity: '1', unit: 'cup' },
            { name: 'Peanut butter', quantity: '1/2', unit: 'cup' },
            { name: 'Honey', quantity: '1/4', unit: 'cup' },
            { name: 'Chia seeds', quantity: '2', unit: 'tbsp' },
            { name: 'Dark chocolate chips', quantity: '1/4', unit: 'cup' }
          ],
          instructions: [
            'Mix all ingredients in a bowl',
            'Roll into small balls',
            'Refrigerate for 30 minutes to set',
            'Store in airtight container'
          ],
          prepTime: 10,
          cookTime: 0,
          servings: 12,
          calories: 120,
          protein: 4,
          carbs: 15,
          fat: 6
        }
      ]
    };

    const templates = recipeTemplates[mealType] || recipeTemplates['Breakfast'];
    const selectedRecipe = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      _id: `fallback-${mealType}-${Date.now()}`,
      ...selectedRecipe,
      dietaryTags: ['Healthy', 'Balanced'],
      cuisine: 'International',
      mealType: mealType,
      aiGenerated: false,
      isFallback: true
    };
  };

  const generateCompleteMealPlan = async () => {
    if (!isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
      return;
    }

    setGeneratingPlan(true);
    setNetworkError(false);
    
    try {
      const mealsToGenerate = mealPlan.meals.filter(meal => !meal.recipeId);
      
      if (mealsToGenerate.length === 0) {
        Alert.alert('Info', 'All meals already have recipes!');
        return;
      }

      for (const meal of mealsToGenerate) {
        await generateAIRecipe(meal.mealType);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      Alert.alert('Success!', 'Complete meal plan generated!');
    } catch (error) {
      console.error('Error generating complete plan:', error);
      if (error.message === 'NO_INTERNET') {
        setNetworkError(true);
        Alert.alert('Network Error', 'Please check your connection and try again.');
      } else {
        Alert.alert('Info', 'Generated demo recipes. Start backend for AI recipes.');
      }
    } finally {
      setGeneratingPlan(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMealPlan().finally(() => setRefreshing(false));
  };

  const toggleMealConsumed = (mealIndex) => {
    const updatedMeals = [...mealPlan.meals];
    updatedMeals[mealIndex].consumed = !updatedMeals[mealIndex].consumed;
    
    setMealPlan({
      ...mealPlan,
      meals: updatedMeals
    });

    Alert.alert(
      updatedMeals[mealIndex].consumed ? 'Meal Completed!' : 'Meal Unmarked',
      updatedMeals[mealIndex].recipeId 
        ? `${updatedMeals[mealIndex].recipeId.name} has been ${updatedMeals[mealIndex].consumed ? 'marked as consumed' : 'unmarked'}`
        : `Meal has been ${updatedMeals[mealIndex].consumed ? 'marked as consumed' : 'unmarked'}`
    );
  };

  const replaceMeal = (mealType) => {
    Alert.alert(
      `Replace ${mealType}`,
      `Generate a new recipe for ${mealType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate New', 
          onPress: () => generateAIRecipe(mealType)
        }
      ]
    );
  };

  const viewRecipeDetails = (recipe) => {
    if (recipe) {
      navigation.navigate('RecipeDetails', { recipe });
    } else {
      Alert.alert('No Recipe', 'Please generate a recipe first');
    }
  };

  const getTotalCalories = () => {
    if (!mealPlan || !mealPlan.meals) return 0;
    return mealPlan.meals.reduce((total, meal) => {
      return total + (meal.recipeId?.calories || 0);
    }, 0);
  };

  const getConsumedCalories = () => {
    if (!mealPlan || !mealPlan.meals) return 0;
    return mealPlan.meals
      .filter(meal => meal.consumed)
      .reduce((total, meal) => total + (meal.recipeId?.calories || 0), 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render backend status
  const renderBackendStatus = () => {
    if (!backendAvailable && isConnected) {
      return (
        <Card style={styles.backendStatusCard}>
          <Card.Content>
            <View style={styles.backendStatusContent}>
              <Ionicons name="server-outline" size={moderateScale(20)} color="#ff6b6b" />
              <View style={styles.backendStatusText}>
                <Text style={styles.backendStatusTitle}>Backend Server Offline</Text>
                <Text style={styles.backendStatusSubtitle}>
                  Using demo recipes. Start your backend server for AI-powered recipes.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    }
    return null;
  };

  const getGenerateButtonText = () => {
    if (!isConnected) return 'No Internet Connection';
    if (!backendAvailable) return 'Generate Demo Recipe';
    return 'Generate with AI';
  };

  const renderMealCard = (meal, index) => {
    const hasRecipe = meal.recipeId !== null;
    const isGenerating = generatingRecipe === meal.mealType;

    return (
      <Card key={meal.mealType} style={styles.mealCard}>
        <Card.Content>
          <View style={styles.mealHeader}>
            <View style={styles.mealTypeContainer}>
              <Text style={styles.mealType}>{meal.mealType}</Text>
              <Text style={styles.mealTime}>
                {meal.mealType === 'Breakfast' ? '7:00 AM' : 
                 meal.mealType === 'Lunch' ? '12:30 PM' :
                 meal.mealType === 'Dinner' ? '7:00 PM' : '3:00 PM'}
              </Text>
            </View>
            
            {hasRecipe && (
              <View style={styles.calorieBadge}>
                <Text style={styles.calorieText}>{meal.recipeId.calories} cal</Text>
              </View>
            )}
          </View>

          {hasRecipe ? (
            <>
              <TouchableOpacity 
                style={styles.recipeInfo}
                onPress={() => viewRecipeDetails(meal.recipeId)}
              >
                <Text style={styles.recipeName}>{meal.recipeId.name}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {meal.recipeId.description}
                </Text>
                <Text style={styles.recipeMeta}>
                  {meal.recipeId.prepTime + meal.recipeId.cookTime} min • {meal.recipeId.dietaryTags?.join(', ')}
                </Text>
              </TouchableOpacity>

              <View style={styles.mealActions}>
                <TouchableOpacity 
                  style={[
                    styles.consumedButton,
                    meal.consumed && styles.consumedButtonActive
                  ]}
                  onPress={() => toggleMealConsumed(index)}
                >
                  <Ionicons 
                    name={meal.consumed ? "checkmark-circle" : "checkmark-circle-outline"} 
                    size={moderateScale(20)} 
                    color={meal.consumed ? "#4CAF50" : "#666"} 
                  />
                  <Text style={[
                    styles.consumedButtonText,
                    meal.consumed && styles.consumedButtonTextActive
                  ]}>
                    {meal.consumed ? 'Consumed' : 'Mark as Eaten'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.replaceButton}
                  onPress={() => replaceMeal(meal.mealType)}
                  disabled={!isConnected}
                >
                  <Ionicons 
                    name="refresh" 
                    size={moderateScale(16)} 
                    color={isConnected ? "#666" : "#ccc"} 
                  />
                  <Text style={[
                    styles.replaceButtonText,
                    !isConnected && styles.disabledText
                  ]}>
                    Replace
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyMeal}>
              <Text style={styles.emptyMealText}>No recipe generated yet</Text>
              <TouchableOpacity 
                style={[
                  styles.generateMealButton,
                  (!isConnected || isGenerating) && styles.disabledButton
                ]}
                onPress={() => generateAIRecipe(meal.mealType)}
                disabled={!isConnected || isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons 
                      name="sparkles" 
                      size={moderateScale(16)} 
                      color={isConnected ? "#fff" : "#ccc"} 
                    />
                    <Text style={styles.generateMealText}>
                      {getGenerateButtonText()}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A8E6CF" />
        <Text style={styles.loadingText}>Setting up your meal plan...</Text>
      </View>
    );
  }

  const meals = mealPlan?.meals || [];

  return (
    <View style={styles.container}>
      {/* Network Status Banner */}
      {!isConnected && (
        <View style={styles.networkBanner}>
          <Ionicons name="wifi-outline" size={moderateScale(16)} color="#fff" />
          <Text style={styles.networkBannerText}>No internet connection</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Meal Plan</Text>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => setShowCalendar(true)}
        >
          <Ionicons name="calendar" size={moderateScale(24)} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => {
            const yesterday = new Date(selectedDate);
            yesterday.setDate(yesterday.getDate() - 1);
            setSelectedDate(yesterday.toISOString().split('T')[0]);
          }}
        >
          <Ionicons name="chevron-back" size={moderateScale(20)} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <Ionicons name="chevron-down" size={moderateScale(16)} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => {
            const tomorrow = new Date(selectedDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
          }}
        >
          <Ionicons name="chevron-forward" size={moderateScale(20)} color="#333" />
        </TouchableOpacity>
      </View>

      {/* AI Generation Banner */}
      <Card style={styles.aiBanner}>
        <Card.Content>
          <View style={styles.aiBannerContent}>
            <Ionicons name="sparkles" size={moderateScale(24)} color="#A8E6CF" />
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>AI-Powered Meal Planning</Text>
              <Text style={styles.aiBannerSubtitle}>
                {isConnected 
                  ? (backendAvailable 
                    ? 'Generate complete recipes with ingredients and instructions' 
                    : 'Backend offline - using demo recipes')
                  : 'Connect to internet to generate AI recipes'
                }
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Backend Status */}
      {renderBackendStatus()}

      {/* Calorie Summary */}
      <Card style={styles.calorieCard}>
        <Card.Content>
          <Text style={styles.calorieTitle}>Daily Nutrition</Text>
          <View style={styles.calorieProgress}>
            <LinearGradient
              colors={['#A8E6CF', '#A0E7E5']}
              style={[
                styles.calorieProgressBar,
                { 
                  width: `${getTotalCalories() > 0 ? (getConsumedCalories() / getTotalCalories()) * 100 : 0}%` 
                }
              ]}
            />
          </View>
          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieStatValue}>{getConsumedCalories()}</Text>
              <Text style={styles.calorieStatLabel}>Consumed</Text>
            </View>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieStatValue}>{getTotalCalories() - getConsumedCalories()}</Text>
              <Text style={styles.calorieStatLabel}>Remaining</Text>
            </View>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieStatValue}>{getTotalCalories()}</Text>
              <Text style={styles.calorieStatLabel}>Total</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Meal Plan */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A8E6CF']}
          />
        }
      >
        {meals.map((meal, index) => renderMealCard(meal, index))}

        {/* Generate Complete Plan Button */}
        <TouchableOpacity 
          style={[
            styles.generatePlanButton,
            (!isConnected || generatingPlan) && styles.disabledButton
          ]}
          onPress={generateCompleteMealPlan}
          disabled={!isConnected || generatingPlan}
        >
          <LinearGradient
            colors={isConnected ? ['#A8E6CF', '#A0E7E5'] : ['#cccccc', '#bbbbbb']}
            style={styles.generatePlanGradient}
          >
            {generatingPlan ? (
              <ActivityIndicator color="#333" />
            ) : (
              <>
                <Ionicons 
                  name="sparkles" 
                  size={moderateScale(20)} 
                  color={isConnected ? "#333" : "#666"} 
                />
                <Text style={styles.generatePlanText}>
                  {isConnected 
                    ? (backendAvailable ? 'Generate Complete Plan' : 'Generate Demo Plan')
                    : 'No Internet Connection'
                  }
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Network Info Card */}
        {!isConnected && (
          <Card style={styles.networkInfoCard}>
            <Card.Content>
              <View style={styles.networkInfoContent}>
                <Ionicons name="wifi-outline" size={moderateScale(24)} color="#666" />
                <View style={styles.networkInfoText}>
                  <Text style={styles.networkInfoTitle}>Offline Mode</Text>
                  <Text style={styles.networkInfoSubtitle}>
                    Connect to internet to generate new AI recipes. You can still view existing recipes.
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>How it works:</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>• Click "Generate with AI" for individual meals</Text>
              <Text style={styles.infoItem}>• Or use "Generate Complete Plan" for all meals</Text>
              <Text style={styles.infoItem}>• AI creates recipes with full ingredients & instructions</Text>
              <Text style={styles.infoItem}>• Mark meals as consumed to track progress</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  networkBanner: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  networkBannerText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: fonts.small,
  },
  backendStatusCard: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: '#fff5f5',
    borderColor: '#ff6b6b',
    borderWidth: 1,
    borderRadius: moderateScale(12),
  },
  backendStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backendStatusText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  backendStatusTitle: {
    fontSize: fonts.small,
    fontWeight: 'bold',
    color: '#d63031',
    marginBottom: spacing.xs,
  },
  backendStatusSubtitle: {
    fontSize: fonts.tiny,
    color: '#666',
    lineHeight: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: fonts.h3,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarButton: {
    padding: spacing.xs,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dateNavButton: {
    padding: spacing.sm,
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f9fa',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: '#333',
    marginRight: spacing.xs,
  },
  aiBanner: {
    margin: spacing.md,
    borderRadius: moderateScale(16),
    backgroundColor: '#f0f9f0',
    borderColor: '#A8E6CF',
    borderWidth: 2,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBannerText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  aiBannerSubtitle: {
    fontSize: fonts.small,
    color: '#666',
    lineHeight: moderateScale(18),
  },
  calorieCard: {
    margin: spacing.md,
    marginTop: 0,
    borderRadius: moderateScale(16),
    elevation: 4,
  },
  calorieTitle: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
  },
  calorieProgress: {
    height: verticalScale(8),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(4),
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  calorieProgressBar: {
    height: '100%',
    borderRadius: moderateScale(4),
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calorieStat: {
    alignItems: 'center',
    flex: 1,
  },
  calorieStatValue: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieStatLabel: {
    fontSize: fonts.small,
    color: '#666',
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  mealCard: {
    marginBottom: spacing.sm,
    borderRadius: moderateScale(16),
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  mealTypeContainer: {
    flex: 1,
  },
  mealType: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  mealTime: {
    fontSize: fonts.small,
    color: '#666',
  },
  calorieBadge: {
    backgroundColor: '#A8E6CF',
    paddingHorizontal: spacing.sm,
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  calorieText: {
    fontSize: fonts.small,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeInfo: {
    marginBottom: spacing.md,
  },
  recipeName: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    fontSize: fonts.small,
    color: '#666',
    lineHeight: moderateScale(18),
    marginBottom: spacing.xs,
  },
  recipeMeta: {
    fontSize: fonts.tiny,
    color: '#888',
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
    marginRight: spacing.xs,
  },
  consumedButtonActive: {
    backgroundColor: '#f0f9f0',
    borderColor: '#4CAF50',
  },
  consumedButtonText: {
    marginLeft: spacing.xs,
    fontSize: fonts.small,
    color: '#666',
    fontWeight: '500',
  },
  consumedButtonTextActive: {
    color: '#4CAF50',
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  replaceButtonText: {
    marginLeft: spacing.xs,
    fontSize: fonts.small,
    color: '#666',
    fontWeight: '500',
  },
  emptyMeal: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyMealText: {
    fontSize: fonts.small,
    color: '#666',
    marginBottom: spacing.sm,
  },
  generateMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8E6CF',
    paddingHorizontal: spacing.md,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  generateMealText: {
    marginLeft: spacing.xs,
    fontSize: fonts.small,
    fontWeight: '600',
    color: '#333',
  },
  generatePlanButton: {
    borderRadius: moderateScale(16),
    marginBottom: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generatePlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: moderateScale(16),
  },
  generatePlanText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: spacing.xs,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#ccc',
  },
  networkInfoCard: {
    marginBottom: spacing.md,
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  networkInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkInfoText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  networkInfoTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  networkInfoSubtitle: {
    fontSize: fonts.small,
    color: '#666',
    lineHeight: moderateScale(18),
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  infoTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
  },
  infoList: {
    marginLeft: spacing.xs,
  },
  infoItem: {
    fontSize: fonts.small,
    color: '#666',
    marginBottom: spacing.xs,
    lineHeight: moderateScale(18),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.body,
    color: '#666',
  },
});

export default MealPlanScreen;