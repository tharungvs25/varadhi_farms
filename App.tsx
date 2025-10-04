import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PoultryProvider } from './src/contexts/PoultryContext';
import DashboardScreen from './src/screens/DashboardScreen';
import BatchesScreen from './src/screens/BatchesScreen';
import CabinsScreen from './src/screens/CabinsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PoultryProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ title: 'Varahi Farms' }}
            />
            <Stack.Screen 
              name="Batches" 
              component={BatchesScreen}
              options={{ title: 'Chick Batches' }}
            />
            <Stack.Screen 
              name="Cabins" 
              component={CabinsScreen}
              options={{ title: 'Cabins' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </PoultryProvider>
    </SafeAreaProvider>
  );
}
