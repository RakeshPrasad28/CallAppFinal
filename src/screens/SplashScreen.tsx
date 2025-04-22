import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {navigate} from '../utils/NavigationUtils';

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('UserBottomTab');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View
      style={{
        backgroundColor: 'salmon',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;
