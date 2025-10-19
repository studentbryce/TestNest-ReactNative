// HomeScreen.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from '../styles/global';
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {
  const features = [
    {
      icon: '📝',
      title: 'Interactive MCQ Tests',
      description: 'Practice with expertly crafted multiple-choice questions'
    },
    {
      icon: '📊',
      title: 'Instant Results',
      description: 'Get immediate feedback and detailed analytics'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Content',
      description: 'Questions created by qualified tutors and educators'
    },
    {
      icon: '📱',
      title: 'Mobile Learning',
      description: 'Study anywhere, anytime with our mobile-first design'
    }
  ];

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Header navigation={navigation} />

      {/* Hero Section */}
      <View style={globalStyles.homeHeroSection}>
        <Image source={require('../images/TestNestLogo.png')} style={globalStyles.homeLogoImage} />
        <Text style={globalStyles.homeMainTitle}>Welcome to TestNest 🪺</Text>
        <Text style={globalStyles.homeSubtitle}>
          Your comprehensive platform for MCQ practice and assessment
        </Text>
        <Text style={globalStyles.homeTagline}>
          Join thousands of students improving their knowledge through interactive testing
        </Text>
      </View>

      {/* Feature Cards */}
      <View style={globalStyles.featuresSection}>
        <Text style={globalStyles.sectionTitle}>Why Choose TestNest?</Text>
        <View style={globalStyles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={globalStyles.featureCard}>
              <Text style={globalStyles.featureIcon}>{feature.icon}</Text>
              <Text style={globalStyles.featureTitle}>{feature.title}</Text>
              <Text style={globalStyles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      {/*
      <View style={globalStyles.statsSection}>
        <View style={globalStyles.statItem}>
          <Text style={globalStyles.statNumber}>1000+</Text>
          <Text style={globalStyles.statLabel}>Practice Questions</Text>
        </View>
        <View style={globalStyles.statItem}>
          <Text style={globalStyles.statNumber}>500+</Text>
          <Text style={globalStyles.statLabel}>Active Students</Text>
        </View>
        <View style={globalStyles.statItem}>
          <Text style={globalStyles.statNumber}>95%</Text>
          <Text style={globalStyles.statLabel}>Success Rate</Text>
        </View>
      </View>
      */}

      {/* Call to Action Section */}
      <View style={globalStyles.ctaSection}>
        <TouchableOpacity 
          style={globalStyles.primaryCTAButton} 
          onPress={() => navigation.navigate('DemoTest')}
        >
          <Text style={globalStyles.primaryCTAText}>🚀 Try Demo Test</Text>
        </TouchableOpacity>

        <Text style={globalStyles.orText}>or</Text>

        <View style={globalStyles.authButtonsContainer}>
          <TouchableOpacity 
            style={globalStyles.secondaryButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={globalStyles.secondaryButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.secondaryButton} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={globalStyles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={globalStyles.linkButton} 
          onPress={() => navigation.navigate('About')}
        >
          <Text style={globalStyles.linkButtonText}>Learn more about TestNest →</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={globalStyles.bottomSpacing} />
    </ScrollView>
  );
}
