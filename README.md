# Tally

A React Native (Expo) app for tracking competitive programming progress with a partner.

## Features

- Track daily coding problem progress (2 problems/day)
- 372 problems across 12 rating levels (800-1900)
- See your partner's progress in real-time
- Push notifications when partner completes a problem
- Carryover: incomplete tasks carry forward

## Tech Stack

- React Native with Expo SDK 54
- Firebase (Auth + Firestore)
- NativeWind (Tailwind CSS)
- TypeScript

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add 2 users manually in Firebase Auth console
5. Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

### 3. Run the app

```bash
npx expo start
```

## Building for Production

### Android APK

```bash
# First time: configure EAS
npx eas build:configure

# Build APK for direct install
npx eas build --platform android --profile preview
```

### iOS

Requires Apple Developer account ($99/year):

```bash
npx eas build --platform ios --profile preview
```

## Project Structure

```
tally/
├── App.tsx                 # Root with navigation
├── src/
│   ├── config/
│   │   ├── firebase.ts     # Firebase init
│   │   └── constants.ts    # Users, ratings, start date
│   ├── data/
│   │   └── problems.ts     # 372 hardcoded problems
│   ├── services/
│   │   ├── authService.ts
│   │   ├── progressService.ts
│   │   ├── taskCalculator.ts
│   │   └── notificationService.ts
│   ├── hooks/
│   │   └── useTodayTasks.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── AllProblemsScreen.tsx
│   └── components/
│       └── TaskCard.tsx
```
