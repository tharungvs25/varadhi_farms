# Vardhi Farms Mobile App

A React Native Expo application for managing poultry farm operations, including chick batches and cabins.

## Features

- **Dashboard**: Monitor farm operations with real-time statistics
  - Total chicks count across all batches
  - Total cabins and capacity
  - Available space tracking
  - Cabin occupancy visualization
  - Recent batches overview

- **Batch Management**: 
  - Add new chick batches
  - Track source, number of chicks, life span, and date of birth
  - Assign batches to cabins
  - Delete batches
  - Add notes for each batch

- **Cabin Management**:
  - Add new cabins with capacity
  - View occupancy percentage
  - Track assigned batches
  - Delete cabins (batches will be unassigned)

## Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open the app:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `a` to open in Android emulator
   - Press `i` to open in iOS simulator
   - Press `w` to open in web browser

## Data Persistence

All data is stored locally on the device using AsyncStorage. Data persists between app sessions.

## Project Structure

```
vardhi-farms-app/
├── src/
│   ├── contexts/
│   │   └── PoultryContext.tsx    # State management
│   └── screens/
│       ├── DashboardScreen.tsx   # Main dashboard
│       ├── BatchesScreen.tsx     # Batch management
│       └── CabinsScreen.tsx      # Cabin management
├── App.tsx                        # Main app component with navigation
└── package.json
```

## Navigation

The app uses React Navigation with a stack navigator:
- Dashboard (Home screen)
- Batches (Batch management)
- Cabins (Cabin management)

## Development

- Built with Expo SDK 54
- Uses React Native 0.81.4
- Supports iOS, Android, and Web platforms

## Future Enhancements

- Backend API integration
- User authentication
- Data synchronization
- Push notifications
- Export reports
- Photo uploads for batches
