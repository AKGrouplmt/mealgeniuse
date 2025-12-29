import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

const slides = [
  {
    title: "Personalized Nutrition for Your Lifestyle",
    description: "Get customized meal plans based on your unique health goals and preferences",
    color: ['#A8E6CF', '#A0E7E5']
  },
  {
    title: "AI Meal Plans for Your Health Goals",
    description: "Smart AI generates perfect recipes for weight loss, muscle gain, or maintaining health",
    color: ['#A0E7E5', '#FFD3B6']
  },
  {
    title: "Track Progress & Stay Motivated",
    description: "Monitor your nutrition, water intake, and achievements with beautiful analytics",
    color: ['#FFD3B6', '#A8E6CF']
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('SignUp');
    }
  };

  return (
    <LinearGradient colors={slides[currentSlide].color} style={styles.container}>
      <View style={styles.slide}>
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
        
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.activeDot
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={nextSlide}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: '#333',
    lineHeight: moderateScale(32),
  },
  description: {
    fontSize: fonts.body,
    textAlign: 'center',
    color: '#666',
    lineHeight: moderateScale(24),
  },
  pagination: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#ccc',
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    backgroundColor: '#333',
    width: moderateScale(24),
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: moderateScale(25),
  },
  buttonText: {
    color: '#fff',
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;