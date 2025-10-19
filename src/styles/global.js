import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '../theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  header: {
    backgroundColor: colors.background,
    padding: 5,
    paddingTop: 40,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: '80%',
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: fonts.body,
    color: colors.textDark,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.text,
    textAlign: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    width: screenWidth * 0.8,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.title,
  },
  selectionButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    width: screenWidth * 0.8,
  },
  selectionText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.body,
  },
  link: {
    color: colors.accent,
    fontFamily: fonts.body,
  },
  homeLogoImage: {
    width: screenWidth * 0.5,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.textDark,
    backgroundColor: colors.background,
    margin: 10,
  },
  textCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Password field styles
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
  // Drawer styles
  drawerContainer: {
    backgroundColor: colors.background,
  },
  drawerStyle: {
    backgroundColor: colors.background,
    width: 280,
  },
  drawerItemStyle: {
    marginVertical: 2,
    borderRadius: 8,
  },
  drawerItemHidden: {
    marginVertical: 2,
    borderRadius: 8,
    display: 'none',
  },
  drawerLabelStyle: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: -10,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  drawerHeaderText: {
    color: colors.secondary,
    fontSize: 24,
    fontFamily: fonts.title,
    textAlign: 'center',
  },

  // Home Screen Enhanced Styles
  homeHeroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  homeMainTitle: {
    fontSize: 32,
    fontFamily: fonts.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  homeSubtitle: {
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  homeTagline: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 30,
  },

  // Features Section
  featuresSection: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fonts.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.accent,
    borderRadius: 15,
    paddingVertical: 20,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textDark,
    textAlign: 'center',
  },

  // Call to Action Section
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryCTAButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryCTAText: {
    color: colors.secondary,
    fontSize: 20,
    fontFamily: fonts.title,
    textAlign: 'center',
  },
  orText: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
    marginVertical: 10,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '45%',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.title,
    textAlign: 'center',
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontFamily: fonts.body,
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 30,
  },
  //timer Section - Updated for circular progress
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  timerCircle: {
    width: 100, // Increased size for better visibility
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.title,
    color: colors.textDark,
    zIndex: 2, // Ensure text is above the progress circle
  },
  timerLabel: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: fonts.body,
    color: colors.textDark,
    zIndex: 2,
  },

  //question progress Section
  questionProgress: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: fonts.body,
    fontWeight: '500',
    marginTop: 10,
  },
  questionContainer: {
    flex: 1,
  },
  // password input field Section
  passwordInputContainer: {
    position: 'relative',
    width: '95%',
    margin: 10,
    marginLeft: 10,
  },
  passwordInput: {
    paddingRight: 0, // Make room for the eye icon
    margin: 0, // Remove margin since container handles it
    backgroundColor: colors.background,
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: 10, // Position from top instead of using transform
    padding: 5,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Dashboard Info Card - Consistent with textCard style
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent + '20', // Add transparency
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.textDark,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // Menu Cards - Similar to feature cards but adapted for navigation
  menuCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center', // This should align items within the row, not the card itself
  },
  menuIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: colors.background,
    borderRadius: 25,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textDark,
    lineHeight: 18,
  },
  menuArrow: {
    paddingLeft: 15,
  },
  menuArrowText: {
    fontSize: 20,
    color: colors.accent,
    fontFamily: fonts.title,
  },

  // Section Titles - Consistent with existing sectionTitle
  section: {
    marginVertical: 10,
  },

  // Remove duplicate styles and keep consistent naming
  dashboardSectionTitle: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: colors.primary,
    textAlign: 'left',
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  testInfoCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    fontFamily: fonts.title,
    marginBottom: 5,
    textAlign: 'center',
  },
  testCategory: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    fontFamily: fonts.body,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  gradeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradeText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: fonts.title,
  },
  timeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  timeStat: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.title,
    color: colors.primary,
  },
  timeLabel: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: fonts.body,
    marginTop: 5,
  },

  testCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1 }], // For smooth animation
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    minHeight: 50, // Add minimum height to prevent overlap
  },
  testTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    flex: 1,
    marginRight: 15, // Increased from 10 to 15 for more spacing
    paddingRight: 5, // Add padding to ensure text doesn't touch the badge
  },
  testIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2, // Slight adjustment for alignment
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    lineHeight: 24,
    flexWrap: 'wrap', // Allow text wrapping
  },
  testTimeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8, // Increased from 6 to 8 for better proportion
    borderRadius: 20,
    minWidth: 85, // Increased from 80 to 85 for more space
    alignItems: 'center',
    alignSelf: 'flex-start', // Ensure it aligns to the top
    flexShrink: 0, // Prevent shrinking
  },
  testTimeBadgeText: {
    color: colors.textDark,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.body,
    textAlign: 'center',
  },
  testDescription: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: fonts.body,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 4, // Add small top margin for better spacing
  },
  testMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.body,
  },
  testType: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: fonts.body,
    fontStyle: 'italic',
  },
  testCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
  testInfo: {
    flex: 1,
  },
  testInfoText: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: fonts.body,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Instructions card styles
  instructionsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionsList: {
    paddingLeft: 10,
  },
  instructionItem: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.textDark,
    marginBottom: 8,
    lineHeight: 22,
  },

  // Empty state styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Form styling for EditProfile and other forms
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.title,
    color: colors.textDark,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'relative',
  },
  inputError: {
    borderColor: colors.error || '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.error || '#FF6B6B',
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.title,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Test card start button styles
  startTestButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    alignItems: 'center',
  },
  startTestButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.title,
    fontWeight: '600',
  },
});