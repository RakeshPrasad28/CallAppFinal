import {View, Text, StatusBar} from 'react-native';
import React from 'react';

const HomeScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar backgroundColor="#fff" barStyle='dark-content'/>
      <Text style={{fontSize: 20, marginBottom: 20}}>
        📲 Call Detection App
      </Text>
    </View>
  );
};

export default HomeScreen;
