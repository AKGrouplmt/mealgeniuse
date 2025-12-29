import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// CORRECT IMPORT - import each item individually
import { 
  width, 
  moderateScale, 
  verticalScale, 
  fonts, 
  isLargeDevice,
  spacing, 
  isSmallDevice 
} from '../utils/responsive';

const API_BASE_URL = 'http://10.96.20.123:5000/api';


const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Aarya',
    calories: { consumed: 0, goal: 1800 },
    protein: { consumed: 0, goal: 80 },
    carbs: { consumed: 0, goal: 250 },
    water: { consumed: 0, goal: 2.5 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      setTimeout(() => {
        setUserData({
          name: 'Aarya',
          calories: { consumed: 1200, goal: 1800 },
          protein: { consumed: 60, goal: 80 },
          carbs: { consumed: 150, goal: 250 },
          water: { consumed: 1.5, goal: 2.5 }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading progress:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      title: 'Generate AI Recipe', 
      icon: '🧠', 
      onPress: () => navigation.navigate('GenerateRecipe') 
    },
    { 
      title: 'My Diet Plan', 
      icon: '🗓', 
      onPress: () => navigation.navigate('MealPlan') 
    },
    { 
      title: 'Health Tracker', 
      icon: '📊', 
      onPress: () => navigation.navigate('HealthTracker') 
    },
    { 
      title: 'AI Nutritionist', 
      icon: '💬', 
      onPress: () => navigation.navigate('Chat')
    },
  ];

  const aiRecommendations = [
    { 
      name: 'Zucchini Pasta', 
      calories: 350,
      onPress: () => navigation.navigate('RecipeDetails', { 
        recipe: {
          _id: '1',
          name: 'Zucchini Pasta',
          description: 'A light and refreshing zucchini pasta dish with fresh herbs.',
          calories: 350,
          protein: 15,
          carbs: 45,
          fat: 12,
          prepTime: 15,
          cookTime: 15,
          servings: 2,
          dietaryTags: ['Vegetarian', 'Low-Carb'],
          ingredients: [
            { name: 'Zucchini', quantity: '2', unit: 'medium' },
            { name: 'Cherry tomatoes', quantity: '1', unit: 'cup' },
            { name: 'Garlic', quantity: '2', unit: 'cloves' },
            { name: 'Olive oil', quantity: '1', unit: 'tbsp' }
          ],
          instructions: [
            'Spiralize zucchini into noodles',
            'Sauté garlic in olive oil',
            'Add cherry tomatoes and cook until soft',
            'Add zucchini noodles and cook for 2-3 minutes',
            'Season with salt, pepper, and herbs'
          ]
        }
      })
    },
    { 
      name: 'Salmon & Asparagus', 
      calories: 420,
      onPress: () => navigation.navigate('RecipeDetails', { 
        recipe: {
          _id: '2',
          name: 'Salmon & Asparagus',
          description: 'Healthy baked salmon with roasted asparagus.',
          calories: 420,
          protein: 35,
          carbs: 8,
          fat: 28,
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          dietaryTags: ['High-Protein', 'Low-Carb'],
          ingredients: [
            { name: 'Salmon fillet', quantity: '2', unit: 'pieces' },
            { name: 'Asparagus', quantity: '1', unit: 'bunch' },
            { name: 'Lemon', quantity: '1', unit: '' },
            { name: 'Olive oil', quantity: '2', unit: 'tbsp' }
          ],
          instructions: [
            'Preheat oven to 400°F',
            'Season salmon and asparagus',
            'Arrange on baking sheet',
            'Bake for 12-15 minutes',
            'Serve with lemon wedges'
          ]
        }
      })
    },
  ];

  const actionCardWidth = (width - spacing.md * 3) / 2;
  const recipeCardWidth = isSmallDevice ? moderateScale(140) : moderateScale(160);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi {userData.name} 👋</Text>
            <Text style={styles.subtitle}>Ready for a healthy day?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Ionicons name="person-circle" size={moderateScale(32)} color="#A8E6CF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutrition Summary */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Today's Nutrition</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{userData.calories.consumed}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <ProgressBar 
                progress={userData.calories.consumed / userData.calories.goal} 
                color="#A8E6CF"
                style={styles.progressBar}
              />
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{userData.protein.consumed}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <ProgressBar 
                progress={userData.protein.consumed / userData.protein.goal} 
                color="#FFD3B6"
                style={styles.progressBar}
              />
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{userData.water.consumed}L</Text>
              <Text style={styles.nutritionLabel}>Water</Text>
              <ProgressBar 
                progress={userData.water.consumed / userData.water.goal} 
                color="#A0E7E5"
                style={styles.progressBar}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Daily Tools</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.actionCard, { width: actionCardWidth }]}
            onPress={action.onPress}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Recommendations */}
      <Text style={styles.sectionTitle}>AI Recipe Recommendations</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {aiRecommendations.map((recipe, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.recipeCard, { width: recipeCardWidth }]}
            onPress={recipe.onPress}
          >
            <LinearGradient
              colors={['#A8E6CF', '#A0E7E5']}
              style={styles.recipeGradient}
            >
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <Text style={styles.recipeCalories}>{recipe.calories} Kcal</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Goal Progress */}
      <Card style={styles.goalCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Weight Loss Goal</Text>
          <View style={styles.goalProgress}>
            <LinearGradient
              colors={['#A8E6CF', '#A0E7E5']}
              style={[styles.progressFill, { width: `${(7.5/10)*100}%` }]}
            />
          </View>
          <Text style={styles.goalText}>7.5kg of 10kg</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fonts.h2,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: fonts.body,
    color: '#666',
    marginTop: spacing.xs,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    borderRadius: moderateScale(16),
    elevation: 4,
  },
  cardTitle: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  nutritionValue: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: fonts.small,
    color: '#666',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  progressBar: {
    height: verticalScale(6),
    borderRadius: moderateScale(3),
    marginTop: spacing.sm,
    width: '100%',
  },
  sectionTitle: {
    fontSize: fonts.h4,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: moderateScale(16),
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    minHeight: verticalScale(90),
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: moderateScale(28),
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fonts.caption,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  horizontalScrollContent: {
    paddingRight: spacing.md,
  },
  recipeCard: {
    marginRight: spacing.sm,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  recipeGradient: {
    padding: spacing.md,
    height: verticalScale(90),
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: fonts.caption,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  recipeCalories: {
    fontSize: fonts.small,
    color: '#333',
  },
  goalCard: {
    borderRadius: moderateScale(16),
    elevation: 4,
    marginTop: spacing.md,
  },
  goalProgress: {
    height: verticalScale(10),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(6),
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(6),
  },
  goalText: {
    fontSize: fonts.caption,
    color: '#666',
    textAlign: 'center',
  },
  profileButton: {
    padding: spacing.xs,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;