import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
  isLargeDevice,
  isSmallDevice
} from '../utils/responsive';

const HealthTrackerScreen = ({ navigation }) => {
  const actionButtonWidth = (width - spacing.md * 3) / 2;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Health Tracker</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#A8E6CF', '#A0E7E5']}
                  style={styles.statCircle}
                >
                  <Text style={styles.statValue}>2.5L</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Water</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#FFD3B6', '#FFAAA5']}
                  style={styles.statCircle}
                >
                  <Text style={styles.statValue}>1,200</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#A0E7E5', '#A8E6CF']}
                  style={styles.statCircle}
                >
                  <Text style={styles.statValue}>7h</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Sleep</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#FFAAA5', '#FFD3B6']}
                  style={styles.statCircle}
                >
                  <Text style={styles.statValue}>30m</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Workout</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { width: actionButtonWidth }]}>
            <Ionicons name="water" size={moderateScale(24)} color="#333" />
            <Text style={styles.actionText}>Log Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { width: actionButtonWidth }]}>
            <Ionicons name="fitness" size={moderateScale(24)} color="#333" />
            <Text style={styles.actionText}>Log Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { width: actionButtonWidth }]}>
            <Ionicons name="bed" size={moderateScale(24)} color="#333" />
            <Text style={styles.actionText}>Log Sleep</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { width: actionButtonWidth }]}>
            <Ionicons name="scale" size={moderateScale(24)} color="#333" />
            <Text style={styles.actionText}>Log Weight</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            <Text style={styles.comingSoon}>Detailed analytics coming soon!</Text>
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
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: moderateScale(16),
  },
  sectionTitle: {
    fontSize: fonts.h4,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
  },
  statCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fonts.body,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: fonts.small,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: spacing.sm,
    elevation: 2,
    minHeight: verticalScale(80),
    justifyContent: 'center',
  },
  actionText: {
    marginTop: spacing.xs,
    fontSize: fonts.small,
    fontWeight: '600',
    color: '#333',
  },
  comingSoon: {
    textAlign: 'center',
    color: '#666',
    fontSize: fonts.body,
    padding: spacing.lg,
  },
});

export default HealthTrackerScreen;