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
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Octicons } from '@expo/vector-icons';
import axios from 'axios';
import { 
  moderateScale, 
  verticalScale, 
  fonts, 
  spacing, 
  width,
  height,
  isLargeDevice,
  isSmallDevice,
  platformPadding 
} from '../utils/responsive';

const API_BASE_URL = 'http://10.96.20.123:5000/api';




const GenerateRecipeScreen = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Dairy-Free', 'Low-Carb', 'High-Protein'];
  const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  const quickCategories = [
    { name: 'Keto', icon: '🥑', diet: 'Keto' },
    { name: 'Vegan', icon: '🌱', diet: 'Vegan' },
    { name: 'High-Protein', icon: '💪', diet: 'High-Protein' },
    { name: 'Low-Calorie', icon: '⚖️', diet: 'low-calorie' },
    { name: 'Quick Meals', icon: '⚡', diet: 'quick' },
    { name: 'Vegetarian', icon: '🥗', diet: 'Vegetarian' }
  ];

  useEffect(() => {
    loadPopularRecipes();
  }, []);

  const loadPopularRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params: { limit: 10 }
      });
      if (response.data.success) {
        setPopularRecipes(response.data.recipes);
      }
    } catch (error) {
      console.error('Error loading popular recipes:', error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const toggleDietaryPreference = (preference) => {
    setDietaryPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleGenerateRecipe = async () => {
    if (!recipeName.trim()) {
      Alert.alert('Enter a Recipe', 'Please enter any food or recipe name');
      return;
    }

    setLoading(true);
    setGeneratedRecipe(null);
    setShowSearchResults(false);

    try {
      console.log('🚀 Generating AI recipe for:', recipeName);
      
      const response = await axios.post(`${API_BASE_URL}/recipes/generate-from-name`, {
        recipeName: recipeName.trim(),
        dietaryPreferences: dietaryPreferences,
        servings: 4
      });

      console.log('✅ AI Recipe received:', response.data);

      if (response.data.success && response.data.recipe) {
        setGeneratedRecipe(response.data.recipe);
        Alert.alert('Success!', `AI created "${response.data.recipe.name}" for you!`);
      } else {
        throw new Error(response.data.message || 'Failed to generate recipe');
      }

    } catch (error) {
      console.error('❌ Error generating recipe:', error);
      
      let errorMessage = 'Failed to generate recipe. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your backend is running on port 5000.';
      }
      
      Alert.alert('Generation Failed', errorMessage);
      
      const fallbackRecipe = createFallbackRecipe(recipeName);
      setGeneratedRecipe(fallbackRecipe);
      Alert.alert('Demo Mode', 'Showing demo recipe. Check backend connection for real AI generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    setShowSearchResults(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params: { q: query, limit: 20 }
      });
      
      if (response.data.success) {
        setSearchResults(response.data.recipes);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search recipes');
    } finally {
      setSearching(false);
    }
  };

  const loadRecipesByCategory = async (category) => {
    setSearching(true);
    setShowSearchResults(true);
    setSearchQuery(category.name);

    try {
      let url = `${API_BASE_URL}/recipes/search`;
      let params = { limit: 20 };

      if (category.diet === 'low-calorie') {
        url = `${API_BASE_URL}/recipes/low-calorie`;
      } else if (category.diet === 'quick') {
        url = `${API_BASE_URL}/recipes/quick`;
      } else {
        params.dietaryTags = category.diet;
      }

      const response = await axios.get(url, { params });
      
      if (response.data.success) {
        setSearchResults(response.data.recipes);
      }
    } catch (error) {
      console.error('Category search error:', error);
      Alert.alert('Error', 'Failed to load recipes');
    } finally {
      setSearching(false);
    }
  };

  const createFallbackRecipe = (name) => {
    const baseRecipes = {
      'paneer': {
        name: 'Restaurant-Style Paneer Tikka',
        description: 'A classic Indian appetizer with marinated paneer cubes grilled to perfection.',
        prepTime: 30,
        cookTime: 15,
        servings: 4,
        calories: 280,
        protein: 18,
        carbs: 12,
        fat: 18,
        dietaryTags: ['Vegetarian', 'Gluten-Free'],
        cuisine: 'Indian',
        mealType: 'Dinner',
        ingredients: [
          { name: 'Paneer', quantity: '250', unit: 'grams' },
          { name: 'Bell peppers', quantity: '2', unit: 'medium' },
          { name: 'Onion', quantity: '1', unit: 'large' },
          { name: 'Yogurt', quantity: '1/2', unit: 'cup' },
          { name: 'Ginger-garlic paste', quantity: '1', unit: 'tbsp' },
          { name: 'Garam masala', quantity: '1', unit: 'tsp' },
          { name: 'Red chili powder', quantity: '1', unit: 'tsp' },
          { name: 'Lemon juice', quantity: '2', unit: 'tbsp' },
          { name: 'Oil', quantity: '2', unit: 'tbsp' }
        ],
        instructions: [
          'Cut paneer, bell peppers, and onion into bite-sized cubes.',
          'In a bowl, mix yogurt, ginger-garlic paste, and all spices.',
          'Add paneer and vegetables to the marinade, mix well.',
          'Cover and refrigerate for at least 2 hours.',
          'Skewer the marinated paneer and vegetables.',
          'Grill for 10-15 minutes until slightly charred.',
          'Serve hot with mint chutney and lemon wedges.'
        ]
      },
      'chicken': {
        name: 'Herb-Roasted Chicken Breast',
        description: 'Juicy chicken breast roasted with fresh herbs and garlic.',
        prepTime: 10,
        cookTime: 25,
        servings: 2,
        calories: 320,
        protein: 35,
        carbs: 8,
        fat: 16,
        dietaryTags: ['High-Protein', 'Low-Carb'],
        cuisine: 'American',
        mealType: 'Dinner',
        ingredients: [
          { name: 'Chicken breast', quantity: '2', unit: 'large' },
          { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
          { name: 'Garlic', quantity: '3', unit: 'cloves' },
          { name: 'Fresh rosemary', quantity: '1', unit: 'tbsp' },
          { name: 'Fresh thyme', quantity: '1', unit: 'tbsp' },
          { name: 'Lemon', quantity: '1', unit: '' },
          { name: 'Salt and pepper', quantity: 'to taste', unit: '' }
        ],
        instructions: [
          'Preheat oven to 400°F (200°C).',
          'Pat chicken breasts dry and season with salt and pepper.',
          'Mix olive oil, minced garlic, and chopped herbs.',
          'Rub the herb mixture over chicken breasts.',
          'Place chicken in baking dish with lemon slices.',
          'Roast for 20-25 minutes until internal temperature reaches 165°F.',
          'Let rest for 5 minutes before serving.'
        ]
      },
      'default': {
        name: 'Custom ' + name + ' Recipe',
        description: `A delicious recipe created with ${name} as the main ingredient.`,
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12,
        dietaryTags: ['Vegetarian'],
        cuisine: 'International',
        mealType: 'Dinner',
        ingredients: [
          { name: name, quantity: '2', unit: 'cups' },
          { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
          { name: 'Garlic', quantity: '3', unit: 'cloves' },
          { name: 'Onion', quantity: '1', unit: 'medium' },
          { name: 'Seasonings', quantity: 'to taste', unit: '' }
        ],
        instructions: [
          `Prepare ${name} according to package instructions or fresh preparation.`,
          'Heat oil in a pan and sauté garlic and onion until fragrant.',
          `Add ${name} and cook for 10-15 minutes.`,
          'Season with your favorite herbs and spices.',
          'Cook until everything is well combined and heated through.',
          'Serve hot and enjoy!'
        ]
      }
    };

    const mainIngredient = name.toLowerCase();
    let recipe;
    
    if (mainIngredient.includes('paneer')) {
      recipe = baseRecipes['paneer'];
    } else if (mainIngredient.includes('chicken')) {
      recipe = baseRecipes['chicken'];
    } else {
      recipe = baseRecipes['default'];
    }

    return {
      ...recipe,
      aiGenerated: true,
      _id: 'fallback-' + Date.now()
    };
  };

  const resetForm = () => {
    setRecipeName('');
    setDietaryPreferences([]);
    setGeneratedRecipe(null);
    setShowSearchResults(false);
  };

  const addToMealPlan = () => {
    if (generatedRecipe) {
      Alert.alert(
        'Success!',
        `"${generatedRecipe.name}" has been added to your meal plan!`,
        [{ text: 'OK' }]
      );
    }
  };

  const viewRecipeDetails = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeItem}
      onPress={() => viewRecipeDetails(item)}
    >
      <View style={styles.recipeItemContent}>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.recipeMeta}>
            <Text style={styles.recipeCalories}>{item.calories} cal</Text>
            <Text style={styles.recipeTime}>⏱ {item.prepTime + item.cookTime}m</Text>
            <Text style={styles.recipeType}>{item.mealType}</Text>
          </View>
          <View style={styles.tagsContainer}>
            {item.dietaryTags.slice(0, 2).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={moderateScale(20)} color="#666" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#A8E6CF', '#A0E7E5']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>AI Chef is creating your recipe...</Text>
          <Text style={styles.loadingSubtext}>This may take 10-20 seconds</Text>
          <Text style={styles.loadingDetail}>Analyzing ingredients and creating perfect recipe</Text>
        </LinearGradient>
      </View>
    );
  }

  if (generatedRecipe && !showSearchResults) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setGeneratedRecipe(null)}
          >
            <Ionicons name="arrow-back" size={moderateScale(24)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>AI Generated Recipe</Text>
          <View style={styles.placeholder} />
        </View>

        <Card style={styles.recipeCard}>
          <LinearGradient
            colors={['#A8E6CF', '#A0E7E5']}
            style={styles.recipeHeader}
          >
            <Text style={styles.recipeNameLarge}>{generatedRecipe.name}</Text>
            <View style={styles.recipeMeta}>
              <Text style={styles.recipeMetaText}>{generatedRecipe.calories} kcal</Text>
              <Text style={styles.recipeMetaText}>•</Text>
              <Text style={styles.recipeMetaText}>{generatedRecipe.prepTime + generatedRecipe.cookTime} min</Text>
              <Text style={styles.recipeMetaText}>•</Text>
              <Text style={styles.recipeMetaText}>{generatedRecipe.dietaryTags.join(', ')}</Text>
            </View>
          </LinearGradient>

          <Card.Content style={styles.recipeContent}>
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
                onPress={() => viewRecipeDetails(generatedRecipe)}
              >
                <Ionicons name="book" size={moderateScale(20)} color="#333" />
                <Text style={styles.secondaryButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{generatedRecipe.description}</Text>

            <Text style={styles.sectionTitle}>Nutrition per Serving</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{generatedRecipe.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{generatedRecipe.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{generatedRecipe.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{generatedRecipe.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>

            <View style={styles.quickInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={moderateScale(16)} color="#666" />
                <Text style={styles.infoText}>Prep: {generatedRecipe.prepTime} min</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="flame-outline" size={moderateScale(16)} color="#666" />
                <Text style={styles.infoText}>Cook: {generatedRecipe.cookTime} min</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={moderateScale(16)} color="#666" />
                <Text style={styles.infoText}>Serves: {generatedRecipe.servings}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.generateAnotherButton}
              onPress={resetForm}
            >
              <Ionicons name="refresh" size={moderateScale(20)} color="#333" />
              <Text style={styles.generateAnotherText}>Generate Another Recipe</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Recipe Generator</Text>
        <Text style={styles.subtitle}>Search 300+ diet recipes or create new ones with AI</Text>

        {/* Search Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🔍 Search Diet Recipes</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes (e.g., keto, vegan, chicken, salad)..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                handleSearch(text);
              }}
            />
            
            {searching && (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color="#A8E6CF" />
                <Text style={styles.searchingText}>Searching recipes...</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Quick Categories */}
        <Text style={styles.sectionTitle}>Quick Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categoriesContainer}>
            {quickCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryButton}
                onPress={() => loadRecipesByCategory(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Search Results */}
        {showSearchResults && (
          <Card style={styles.resultsCard}>
            <Card.Content>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                  {searchResults.length} Recipes Found
                </Text>
                <TouchableOpacity onPress={() => setShowSearchResults(false)}>
                  <Text style={styles.closeResults}>Hide</Text>
                </TouchableOpacity>
              </View>
              
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderRecipeItem}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.noResults}>No recipes found. Try AI generation instead!</Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Popular Recipes */}
        {!showSearchResults && popularRecipes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🔥 Popular Recipes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularRecipes.slice(0, 5).map(recipe => (
                <TouchableOpacity 
                  key={recipe._id}
                  style={styles.popularRecipeCard}
                  onPress={() => viewRecipeDetails(recipe)}
                >
                  <LinearGradient
                    colors={['#A8E6CF', '#A0E7E5']}
                    style={styles.popularRecipeGradient}
                  >
                    <Text style={styles.popularRecipeName} numberOfLines={2}>
                      {recipe.name}
                    </Text>
                    <Text style={styles.popularRecipeCalories}>
                      {recipe.calories} cal
                    </Text>
                    <Text style={styles.popularRecipeTime}>
                      ⏱ {recipe.prepTime + recipe.cookTime}m
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* AI Recipe Generation */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🤖 AI Recipe Generator</Text>
            <Text style={styles.sectionSubtitle}>Can't find what you want? Let AI create a custom recipe!</Text>
            
            <Text style={styles.label}>What would you like to cook?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter any food or recipe name (e.g., paneer tikka, keto pizza, vegan pasta)..."
              value={recipeName}
              onChangeText={setRecipeName}
              multiline
            />

            <Text style={styles.label}>Dietary Preferences (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dietScroll}>
              <View style={styles.dietOptions}>
                {dietaryOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dietOption,
                      dietaryPreferences.includes(option) && styles.dietOptionSelected
                    ]}
                    onPress={() => toggleDietaryPreference(option)}
                  >
                    <Text style={[
                      styles.dietOptionText,
                      dietaryPreferences.includes(option) && styles.dietOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[
                styles.generateButton,
                (!recipeName.trim() && styles.generateButtonDisabled)
              ]}
              onPress={handleGenerateRecipe}
              disabled={!recipeName.trim() || loading}
            >
              <LinearGradient
                colors={['#A8E6CF', '#A0E7E5']}
                style={styles.generateButtonGradient}
              >
                <Octicons name="sparkle-fill" size={moderateScale(24)} color="#333" />
                <Text style={styles.generateButtonText}>
                  {loading ? 'Generating...' : 'Generate AI Recipe'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Tip: Search our database first, or use AI for custom creations!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fonts.body,
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: moderateScale(20),
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: moderateScale(16),
    elevation: 2,
  },
  sectionTitle: {
    fontSize: fonts.h5,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: moderateScale(12),
    padding: spacing.md,
    fontSize: fonts.body,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: moderateScale(12),
    padding: spacing.md,
    fontSize: fonts.body,
    minHeight: verticalScale(60),
    textAlignVertical: 'top',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  searchingText: {
    marginLeft: spacing.xs,
    color: '#666',
    fontSize: fonts.small,
  },
  categoriesScroll: {
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingRight: spacing.md,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    marginRight: spacing.sm,
    alignItems: 'center',
    minWidth: moderateScale(80),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    fontSize: moderateScale(24),
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: fonts.small,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dietScroll: {
    marginHorizontal: -spacing.md,
  },
  dietOptions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  dietOption: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: spacing.md,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    marginRight: spacing.xs,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  dietOptionSelected: {
    backgroundColor: '#A8E6CF',
    borderColor: '#A8E6CF',
  },
  dietOptionText: {
    fontSize: fonts.small,
    fontWeight: '600',
    color: '#333',
  },
  dietOptionTextSelected: {
    color: '#fff',
  },
  generateButton: {
    borderRadius: moderateScale(25),
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: moderateScale(25),
  },
  generateButtonText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: fonts.small,
    color: '#666',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  // Loading Styles
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: fonts.h4,
    fontWeight: 'bold',
    color: '#333',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: fonts.body,
    color: '#666',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  loadingDetail: {
    fontSize: fonts.small,
    color: '#666',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  // Generated Recipe Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  placeholder: {
    width: moderateScale(40),
  },
  recipeCard: {
    margin: spacing.md,
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    elevation: 8,
  },
  recipeHeader: {
    padding: spacing.lg,
  },
  recipeNameLarge: {
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
  },
  description: {
    fontSize: fonts.body,
    color: '#666',
    lineHeight: moderateScale(24),
    marginBottom: spacing.lg,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
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
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: fonts.small,
    color: '#666',
    marginLeft: spacing.xs,
  },
  generateAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  generateAnotherText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: spacing.xs,
  },
  // Search Results Styles
  resultsCard: {
    marginBottom: spacing.md,
    borderRadius: moderateScale(16),
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsTitle: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
  },
  closeResults: {
    color: '#A8E6CF',
    fontWeight: '600',
  },
  recipeItem: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recipeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    fontSize: fonts.small,
    color: '#666',
    marginBottom: spacing.xs,
    lineHeight: moderateScale(18),
  },
  recipeMeta: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  recipeCalories: {
    fontSize: fonts.tiny,
    color: '#A8E6CF',
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  recipeTime: {
    fontSize: fonts.tiny,
    color: '#666',
    marginRight: spacing.sm,
  },
  recipeType: {
    fontSize: fonts.tiny,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: spacing.xs,
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(12),
    marginRight: spacing.xs,
  },
  tagText: {
    fontSize: fonts.tiny,
    color: '#666',
    fontWeight: '500',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: fonts.small,
    padding: spacing.lg,
  },
  // Popular Recipes Styles
  popularRecipeCard: {
    width: moderateScale(140),
    marginRight: spacing.sm,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    elevation: 4,
  },
  popularRecipeGradient: {
    padding: spacing.md,
    height: verticalScale(100),
    justifyContent: 'space-between',
  },
  popularRecipeName: {
    fontSize: fonts.small,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  popularRecipeCalories: {
    fontSize: fonts.tiny,
    color: '#333',
    fontWeight: '600',
  },
  popularRecipeTime: {
    fontSize: fonts.tiny,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: fonts.small,
    color: '#666',
    marginBottom: spacing.sm,
  },
});

export default GenerateRecipeScreen;