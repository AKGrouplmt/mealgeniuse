import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
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

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      setTimeout(() => {
        setLoading(false);
        
        Alert.alert(
          'Welcome to MealGenius!',
          'Your account has been created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('App', {
                userData: {
                  name: formData.name,
                  email: formData.email
                }
              })
            }
          ]
        );
      }, 2000);

    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const handleSocialSignUp = (provider) => {
    Alert.alert(
      `${provider} Sign Up`,
      `${provider} authentication will be implemented in production version`,
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#A8E6CF', '#A0E7E5', '#FFD3B6']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={moderateScale(24)} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.placeholder} />
          </View>

          <Text style={styles.subtitle}>
            Join MealGenius and start your personalized nutrition journey
          </Text>

          {/* Sign Up Form */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.visibilityToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={moderateScale(20)} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>
                Must be at least 6 characters long
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={moderateScale(20)} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.visibilityToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={moderateScale(20)} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[
                styles.signUpButton,
                (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) && 
                styles.signUpButtonDisabled
              ]}
              onPress={handleSignUp}
              disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || loading}
            >
              <LinearGradient
                colors={['#A8E6CF', '#A0E7E5']}
                style={styles.signUpButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#333" />
                ) : (
                  <>
                    <Ionicons name="person-add" size={moderateScale(20)} color="#333" />
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign Up */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('Google')}
              >
                <View style={styles.socialButtonContent}>
                  <Ionicons name="logo-google" size={moderateScale(20)} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('Apple')}
              >
                <View style={styles.socialButtonContent}>
                  <Ionicons name="logo-apple" size={moderateScale(20)} color="#000" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: platformPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  placeholder: {
    width: moderateScale(40),
  },
  subtitle: {
    fontSize: fonts.body,
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: moderateScale(22),
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: moderateScale(24),
    padding: spacing.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#e9ecef',
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: fonts.body,
    paddingVertical: spacing.md,
    color: '#333',
  },
  visibilityToggle: {
    padding: spacing.xs,
  },
  passwordHint: {
    fontSize: fonts.tiny,
    color: '#666',
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  signUpButton: {
    borderRadius: moderateScale(16),
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: moderateScale(16),
  },
  signUpButtonText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fonts.small,
    color: '#666',
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  socialButtonText: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: '#333',
    marginLeft: spacing.xs,
  },
  termsText: {
    fontSize: fonts.tiny,
    color: '#666',
    textAlign: 'center',
    lineHeight: moderateScale(16),
    marginBottom: spacing.lg,
  },
  link: {
    color: '#A8E6CF',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: fonts.small,
    color: '#666',
  },
  loginLink: {
    fontSize: fonts.small,
    color: '#A8E6CF',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;