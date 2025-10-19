// HelpScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors, fonts } from '../theme';
import Header from '../components/Header';

export default function HelpScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('student');

  const HelpSection = ({ title, children }) => (
    <View style={styles.helpSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const HelpItem = ({ title, children }) => (
    <View style={styles.helpItem}>
      <Text style={styles.itemTitle}>{title}</Text>
      {children}
    </View>
  );

  const BulletList = ({ items }) => (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bullet}>• </Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Header navigation={navigation} title="Help & Support" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.helpHeader}>
          <Text style={styles.headerSubtitle}>Get the most out of TestNest</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'student' && styles.activeTab]}
            onPress={() => setActiveTab('student')}
          >
            <Text style={[styles.tabText, activeTab === 'student' && styles.activeTabText]}>
              🎓 Student Guide
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tutor' && styles.activeTab]}
            onPress={() => setActiveTab('tutor')}
          >
            <Text style={[styles.tabText, activeTab === 'tutor' && styles.activeTabText]}>
              👨‍🏫 Tutor Guide
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === 'student' && (
            <>
              <HelpSection title="🏁 Getting Started as a Student">
                <HelpItem title="✍️ Student Registration">
                  <Text style={styles.itemDescription}>
                    To create your TestNest account:
                  </Text>
                  <BulletList items={[
                    'Click "Register as Student" on the home page',
                    'Enter your 7-8 digit Student ID (provided by your institution)',
                    'Create a secure password with letters and numbers',
                    'Fill in your personal information',
                    'Your password is securely encrypted for protection'
                  ]} />
                </HelpItem>

                <HelpItem title="🧑‍🎓 Student Login">
                  <Text style={styles.itemDescription}>
                    To access your student portal:
                  </Text>
                  <BulletList items={[
                    'Click "Student Login" on the home page',
                    'Enter your Student ID and password',
                    'Access your personalized dashboard',
                    'If you forget your password, contact your tutor'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="📚 Taking Tests">
                <HelpItem title="🎯 Available Tests">
                  <Text style={styles.itemDescription}>
                    In your Tests section:
                  </Text>
                  <BulletList items={[
                    'View all tests assigned by your tutors',
                    'See test descriptions and question counts',
                    'Check if you\'ve already completed a test',
                    'Start new tests when ready'
                  ]} />
                </HelpItem>

                <HelpItem title="✅ Test Taking Tips">
                  <Text style={styles.itemDescription}>
                    For the best test experience:
                  </Text>
                  <BulletList items={[
                    'Ensure stable internet connection before starting',
                    'Read questions carefully before selecting answers',
                    'Use navigation buttons to move between questions',
                    'Review your answers before submitting',
                    'Submit your test when completely finished'
                  ]} />
                </HelpItem>

                <HelpItem title="⏱️ During the Test">
                  <Text style={styles.itemDescription}>
                    While taking a test:
                  </Text>
                  <BulletList items={[
                    'Progress bar shows your completion status',
                    'Select one answer per question using radio buttons',
                    'Navigate with "Previous" and "Next" buttons',
                    'You must answer each question to proceed',
                    'Click "Finish Test" on the last question'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="📊 Viewing Your Results">
                <HelpItem title="🏆 Your Performance">
                  <Text style={styles.itemDescription}>
                    In the Results section:
                  </Text>
                  <BulletList items={[
                    'View scores for all completed tests',
                    'See percentage scores and detailed breakdowns',
                    'Track your improvement over time',
                    'Review which questions you got right or wrong'
                  ]} />
                </HelpItem>

                <HelpItem title="📈 Understanding Your Stats">
                  <Text style={styles.itemDescription}>
                    Your dashboard shows:
                  </Text>
                  <BulletList items={[
                    'Tests Completed: Total number of tests taken',
                    'Average Score: Your overall performance',
                    'Best Score: Your highest achievement',
                    'Total Questions: Questions answered across all tests'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="🪪 Managing Your Profile">
                <HelpItem title="⚙️ Profile Settings">
                  <Text style={styles.itemDescription}>
                    In your Profile section:
                  </Text>
                  <BulletList items={[
                    'Update your personal information',
                    'Change your password for security',
                    'View your Student ID (cannot be changed)',
                    'Check your registration date'
                  ]} />
                </HelpItem>

                <HelpItem title="🔒 Account Security">
                  <Text style={styles.itemDescription}>
                    Keep your account secure:
                  </Text>
                  <BulletList items={[
                    'Use a strong password with letters and numbers',
                    'Don\'t share your login credentials',
                    'Log out when using shared devices',
                    'Contact your tutor if you suspect unauthorized access'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="🎯 Demo Test">
                <HelpItem title="🚀 Try Before You Register">
                  <Text style={styles.itemDescription}>
                    On the home page, you can:
                  </Text>
                  <BulletList items={[
                    'Take a free demo test with 10 Python questions',
                    'Experience the TestNest interface',
                    'No registration required for the demo',
                    'Get instant results to see how the system works'
                  ]} />
                </HelpItem>
              </HelpSection>
            </>
          )}

          {activeTab === 'tutor' && (
            <>
              <HelpSection title="🏁 Getting Started as a Tutor">
                <HelpItem title="🌐 Browser-Based Tutor Access">
                  <Text style={styles.itemDescription}>
                    Important: Tutors must use the browser-based TestNest application to access the tutor dashboard, 
                    manage tests, create questions, and view student results. The mobile app is designed for students only. 
                    Access the full tutor platform through your web browser at your institution's TestNest portal.
                  </Text>
                </HelpItem>

                <HelpItem title="🔑 Tutor Login">
                  <Text style={styles.itemDescription}>
                    Use your institutional email and password to access your tutor dashboard through the web browser. 
                    If you don't have an account, contact your administrator for credentials.
                  </Text>
                </HelpItem>

                <HelpItem title="⚙️ Dashboard Overview">
                  <Text style={styles.itemDescription}>
                    After logging in, you'll see your tutor dashboard with navigation options:
                  </Text>
                  <BulletList items={[
                    '👥 Users: Manage student accounts and view student information',
                    '📝 Tests: Create and manage your test assessments',
                    '❓ Questions: Build and organize your question bank',
                    '📊 Results: View detailed analytics and student performance'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="👥 Student Management">

                <HelpItem title="📊 Tracking Student Progress">
                  <Text style={styles.itemDescription}>
                    Use the Results section to monitor student performance:
                  </Text>
                  <BulletList items={[
                    'View individual student scores and test history',
                    'Identify students who may need additional support',
                    'Track improvement over time'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="📝 Test Creation & Management">
                <HelpItem title="🎨 Creating Tests">
                  <Text style={styles.itemDescription}>
                    Go to the Tests section to create new assessments:
                  </Text>
                  <BulletList items={[
                    'Set test title, description, and parameters',
                    'Configure time limits and scoring options',
                    'Add questions from your question bank',
                    'Preview tests before publishing'
                  ]} />
                </HelpItem>

                <HelpItem title="❓ Question Bank Management">
                  <Text style={styles.itemDescription}>
                    Use the Questions section to build your question library:
                  </Text>
                  <BulletList items={[
                    'Create multiple-choice questions with 4 answer options',
                    'Set correct answers and difficulty levels',
                    'Organize questions by topic or subject',
                    'Reuse questions across multiple tests'
                  ]} />
                </HelpItem>

                <HelpItem title="🔧 Test Configuration">
                  <Text style={styles.itemDescription}>
                    Best practices for test setup:
                  </Text>
                  <BulletList items={[
                    'Use clear, concise question wording',
                    'Ensure answer choices are mutually exclusive',
                    'Test your questions before assigning to students',
                    'Consider appropriate time limits for your content'
                  ]} />
                </HelpItem>
              </HelpSection>

              <HelpSection title="📈 Analytics & Assessment">
                <HelpItem title="📋 Understanding Results">
                  <Text style={styles.itemDescription}>
                    The Results section provides comprehensive analytics:
                  </Text>
                  <BulletList items={[
                    'Individual student scores and detailed breakdowns',
                    'Question-level analysis showing difficulty',
                    'Time spent on tests and individual questions'
                  ]} />
                </HelpItem>

                <HelpItem title="📤 Data Export">
                  <Text style={styles.itemDescription}>
                    Export functionality for record keeping:
                  </Text>
                  <BulletList items={[
                    'Generate reports for administration',
                    'Track long-term progress trends',
                    'Maintain academic records'
                  ]} />
                </HelpItem>
              </HelpSection>
            </>
          )}

          <HelpSection title="🔧 Troubleshooting">
            <HelpItem title="⚠️ Common Issues">
              <BulletList items={[
                '🔑 Login Problems: Check your Student ID/email and password',
                '🧹 App Issues: Force close and restart the application',
                '🌐 Connection: Ensure stable internet connection',
                '📱 Performance: Keep app updated to latest version',
                '📞 Persistent Issues: Contact your tutor or support'
              ]} />
            </HelpItem>
          </HelpSection>

          <HelpSection title="📞 Contact Support">
            <HelpItem title="">
              <Text style={styles.itemDescription}>
                Need additional help? Contact our support team:
              </Text>
              <BulletList items={[
                '📧 Email: support@testnest.edu',
                '☎️ Phone: 1-800-TEST-NEST',
                '🕐 Hours: Monday-Friday, 8AM-6PM EST',
                '💬 Live Chat: Available during business hours'
              ]} />
            </HelpItem>
          </HelpSection>
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
  helpHeader: {
    alignItems: 'center',
    marginBottom: 20,
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
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 12,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.secondary,
    fontFamily: fonts.title,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  helpSection: {
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
  helpItem: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: colors.textDark,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  bulletList: {
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.accent,
    marginRight: 5,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});