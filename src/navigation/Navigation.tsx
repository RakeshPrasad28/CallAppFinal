import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../utils/NavigationUtils';
import HomeScreen from '../screens/home/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AnimatedTabs from '../screens/tabs/AnimatedTabs';
import SplashScreen from '../screens/SplashScreen';
import FilteredCallLogs from '../screens/home/FilteredCallLogs';
import PersonCallLogs from '../screens/home/PersonCallLogs';


const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false, animation: 'fade'}}
        initialRouteName="SplashScreen">
        <Stack.Screen name='SplashScreen' component={SplashScreen}/>
        <Stack.Screen name='UserBottomTab' component={AnimatedTabs}/>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='FilteredCallLogs' component={FilteredCallLogs}/>
        <Stack.Screen name='PersonCallLogs' component={PersonCallLogs}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
