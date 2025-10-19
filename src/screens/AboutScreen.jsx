// AboutScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors, fonts } from '../theme';
import Header from '../components/Header';

export default function AboutScreen({ navigation }) {
  const AboutSection = ({ title, children }) => (
    <View style={styles.aboutSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const FeatureItem = ({ title, description }) => (
    <View style={styles.featureItem}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Header navigation={navigation} title="About TestNest" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutHeader}>
          <Text style={styles.headerSubtitle}>Revolutionizing Educational Assessment</Text>
        </View>

        <View style={styles.contentContainer}>
          <AboutSection title="🎯 Our Mission">
            <Text style={styles.sectionDescription}>
              TestNest is designed to empower educators with a comprehensive, user-friendly 
              platform for creating, managing, and analyzing multiple choice assessments. 
              We believe that effective testing should be accessible, efficient, and insightful.
            </Text>
          </AboutSection>

          <AboutSection title="🌟 Key Features">
            <FeatureItem 
              title="🎨 Intuitive Test Creation"
              description="Build comprehensive tests with our advanced question builder and manage extensive question banks."
            />
            <FeatureItem 
              title="👨‍🎓 Student Management"
              description="Efficiently manage student records with secure SHA256 password encryption and progress tracking."
            />
            <FeatureItem 
              title="📈 Advanced Analytics"
              description="Gain deep insights with detailed performance reports, class statistics, and individual student analytics."
            />
            <FeatureItem 
              title="🔒 Enterprise Security"
              description="SHA256 password hashing, secure database integration, and role-based access control."
            />
            <FeatureItem 
              title="📱 Mobile Experience"
              description="Responsive design with dedicated mobile app downloads for iOS and Android platforms."
            />
            <FeatureItem 
              title="🎯 Interactive Demo"
              description="Try before you register with our comprehensive Python programming demo test experience."
            />
            <FeatureItem 
              title="📚 Role-Specific Help"
              description="Comprehensive help system with separate guidance for tutors and students."
            />
            <FeatureItem 
              title="🎨 Professional UI"
              description="Beautiful, consistent design with Google Fonts integration and modern styling."
            />
          </AboutSection>

          <AboutSection title="💻 Technology Stack">
            <Text style={styles.sectionDescription}>
              TestNest is built using cutting-edge web technologies to deliver a modern, 
              fast, and reliable experience:
            </Text>
            <FeatureItem 
              title="⚛️ React + Vite"
              description="Modern React framework with Vite for lightning-fast development and performance."
            />
            <FeatureItem 
              title="🗄️ Supabase Database"
              description="Real-time database with secure authentication and data management."
            />
            <FeatureItem 
              title="🔐 Crypto-JS Security"
              description="SHA256 password hashing for enterprise-level security standards."
            />
            <FeatureItem 
              title="🎨 Google Fonts"
              description="Professional typography with Quicksand, Fredoka, and Inter font families."
            />
          </AboutSection>

          <AboutSection title="🎯 What's New">
            <Text style={styles.sectionDescription}>
              Our latest updates bring enhanced functionality and improved user experience:
            </Text>
            <FeatureItem 
              title="📲 Mobile App Store Integration"
              description="Professional app store buttons for iOS App Store and Google Play downloads."
            />
            <FeatureItem 
              title="🐍 Python Demo Test"
              description="Interactive 10-question Python programming quiz for hands-on experience."
            />
            <FeatureItem 
              title="📱 Enhanced Mobile Design"
              description="Fully responsive interface optimized for tablets and mobile devices."
            />
            <FeatureItem 
              title="📖 Role-Based Help System"
              description="Separate help documentation for tutors and students with comprehensive guides."
            />
          </AboutSection>

          <AboutSection title="🚀 Get Started">
            <Text style={styles.sectionDescription}>
              Ready to transform your testing experience? Choose your path to get started 
              with TestNest's powerful assessment platform.
            </Text>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.actionButtonText}>👨‍🎓 Student Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Help')}
              >
                <Text style={styles.actionButtonText}>🆘 Get Help</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.demoNote}>
              🎯 New to TestNest? Try our interactive demo test on the home page - no registration required!
            </Text>
          </AboutSection>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 20, marginBottom: 30 }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={globalStyles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  aboutSection: {
    marginBottom: 25,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 15,
  },
  featureItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: colors.textDark,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  actionButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontFamily: fonts.body,
  },
  demoNote: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 20,
  },
});