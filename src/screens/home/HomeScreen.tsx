import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import CallLogScreen from '../../components/CallLogScreen';

const HomeScreen = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#fff" barStyle='dark-content'/>
      {/* <Text style={{fontSize: 20, marginBottom: 20}}>
        📲 Call Detection App
      </Text> */}
      <CallLogScreen/>
    </View>
  );
};

export default HomeScreen;
