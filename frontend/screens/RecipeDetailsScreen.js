import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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

const RecipeDetailsScreen = ({ navigation, route }) => {
  const { recipe } = route.params || {};
  
  const safeRecipe = {
    _id: recipe?._id || 'unknown-id',
    name: recipe?.name || 'Unknown Recipe',
    description: recipe?.description || 'No description available.',
    ingredients: Array.isArray(recipe?.ingredients) && recipe.ingredients.length > 0 
      ? recipe.ingredients 
      : [{ name: 'Ingredient information not available', quantity: '', unit: '' }],
    instructions: Array.isArray(recipe?.instructions) && recipe.instructions.length > 0
      ? recipe.instructions
      : ['Step-by-step instructions not available.'],
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    servings: recipe?.servings || 1,
    calories: recipe?.calories || 0,
    protein: recipe?.protein || 0,
    carbs: recipe?.carbs || 0,
    fat: recipe?.fat || 0,
    dietaryTags: Array.isArray(recipe?.dietaryTags) && recipe.dietaryTags.length > 0
      ? recipe.dietaryTags
      : ['Unknown'],
    cuisine: recipe?.cuisine || 'Unknown',
    mealType: recipe?.mealType || 'Meal'
  };

  const addToMealPlan = () => {
    Alert.alert(
      'Success!',
      `"${safeRecipe.name}" has been added to your meal plan!`,
      [{ text: 'OK' }]
    );
  };

  const startCooking = () => {
    Alert.alert(
      'Start Cooking',
      'Get your ingredients ready! Cooking mode will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Recipe Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.recipeCard}>
          {/* Recipe Header */}
          <LinearGradient
            colors={['#A8E6CF', '#A0E7E5']}
            style={styles.recipeHeader}
          >
            <Text style={styles.recipeName}>{safeRecipe.name}</Text>
            <View style={styles.recipeMeta}>
              <Text style={styles.recipeMetaText}>{safeRecipe.calories} kcal</Text>
              <Text style={styles.recipeMetaText}>•</Text>
              <Text style={styles.recipeMetaText}>{safeRecipe.prepTime + safeRecipe.cookTime} min</Text>
              <Text style={styles.recipeMetaText}>•</Text>
              <Text style={styles.recipeMetaText}>{safeRecipe.dietaryTags.join(', ')}</Text>
            </View>
          </LinearGradient>

          <Card.Content style={styles.recipeContent}>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={addToMealPlan}
              >
                <Ionicons name="calendar" size={moderateScale(20)} color="#fff" />
                <Text style={styles.primaryButtonText}>Add to Meal Plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={startCooking}
              >
                <Ionicons name="play" size={moderateScale(20)} color="#333" />
                <Text style={styles.secondaryButtonText}>Start Cooking</Text>
              </TouchableOpacity>
            </View>

            {/* Servings & Time */}
            <View style={styles.servingsInfo}>
              <View style={styles.servingItem}>
                <Text style={styles.servingLabel}>Servings</Text>
                <Text style={styles.servingValue}>{safeRecipe.servings}</Text>
              </View>
              <View style={styles.servingItem}>
                <Text style={styles.servingLabel}>Prep Time</Text>
                <Text style={styles.servingValue}>{safeRecipe.prepTime} min</Text>
              </View>
              <View style={styles.servingItem}>
                <Text style={styles.servingLabel}>Cook Time</Text>
                <Text style={styles.servingValue}>{safeRecipe.cookTime} min</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{safeRecipe.description}</Text>

            {/* Nutrition Highlights */}
            <Text style={styles.sectionTitle}>Nutrition Highlights</Text>
            <View style={styles.nutritionHighlights}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{safeRecipe.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{safeRecipe.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{safeRecipe.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
            </View>

            {/* Ingredients */}
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {safeRecipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.ingredientText}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Instructions */}
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              {safeRecipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop: platformPadding,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fonts.h4,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: moderateScale(40),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  recipeCard: {
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    elevation: 8,
  },
  recipeHeader: {
    padding: spacing.lg,
  },
  recipeName: {
    fontSize: fonts.h3,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  recipeMetaText: {
    fontSize: fonts.small,
    color: '#333',
    marginHorizontal: spacing.xs,
  },
  recipeContent: {
    padding: spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    marginRight: spacing.xs,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: spacing.xs,
    fontSize: fonts.small,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    marginLeft: spacing.xs,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: spacing.xs,
    fontSize: fonts.small,
  },
  servingsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: moderateScale(12),
  },
  servingItem: {
    alignItems: 'center',
    flex: 1,
  },
  servingLabel: {
    fontSize: fonts.small,
    color: '#666',
    marginBottom: spacing.xs,
  },
  servingValue: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fonts.body,
    color: '#666',
    lineHeight: moderateScale(24),
    marginBottom: spacing.lg,
  },
  nutritionHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: moderateScale(12),
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: fonts.small,
    color: '#666',
    marginTop: spacing.xs,
  },
  ingredientsList: {
    marginBottom: spacing.lg,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 2,
    borderColor: '#A8E6CF',
    borderRadius: moderateScale(4),
    marginRight: spacing.sm,
  },
  ingredientText: {
    fontSize: fonts.body,
    color: '#333',
    flex: 1,
  },
  instructionsList: {
    marginBottom: spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: moderateScale(30),
    height: moderateScale(30),
    backgroundColor: '#A8E6CF',
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  instructionNumberText: {
    fontSize: fonts.small,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionText: {
    fontSize: fonts.body,
    color: '#333',
    lineHeight: moderateScale(22),
    flex: 1,
  },
});

export default RecipeDetailsScreen;