import React, {FC} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';
import CustomTabBar from './CustomTabBar';
import SettingScreen from '../settings/SettingScreen';

const Tab = createBottomTabNavigator();
const UserBottomTab: FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props)=><CustomTabBar {...props}/>}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default UserBottomTab;
