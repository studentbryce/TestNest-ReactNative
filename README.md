# TestNest - React Native MCQ Testing Application

A comprehensive mobile application for Multiple Choice Question (MCQ) testing built with React Native and Expo, featuring real-time database integration with Supabase.

## Features

- 🔐 **User Authentication** - Student and tutor roles
- 📱 **Cross-Platform** - Works on Android and iOS
- ⏱️ **Timed Tests** - Configurable time limits with warnings
- 📊 **Real-time Results** - Instant scoring and history
- 🎯 **Question Management** - Dynamic test creation
- 📈 **Progress Tracking** - Detailed test analytics
- 🔒 **Secure Database** - Supabase backend with RLS
- 📱 **APK Ready** - EAS build configuration included

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Navigation**: React Navigation 6
- **Styling**: React Native StyleSheet
- **Build**: EAS (Expo Application Services)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/studentbryce/TestNest-ReactNative.git
   cd TestNest-ReactNative
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase credentials.

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Build for Android:
   ```bash
   eas build --platform android --profile preview
   ```

## Database Setup

The complete database schema is available in `database_schema.sql` including:
- User management (students/tutors)
- Question and test structures
- Results tracking with timestamps
- Sample data for testing

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── navigation/     # Navigation configuration
├── screens/        # Application screens
├── services/       # API and database services
├── styles/         # Global styling
└── config/         # Configuration files
```

## Development

- **Platform**: React Native with Expo SDK
- **Database**: Supabase with TypeScript support
- **Testing**: Manual testing with demo data
- **Deployment**: EAS Build for production APKs

## License

Educational project for software development coursework.