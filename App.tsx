import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [callData, setCallData] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any; // 👈 Declare here so it's visible in cleanup

    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS,
        ]);

        if (
          granted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_CALL_LOG'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('✅ Permissions granted');

          const eventEmitter = new NativeEventEmitter(NativeModules.CallModule);
          subscription = eventEmitter.addListener('IncomingCall', (data) => {
            console.log('📞 Incoming call detected:-', data);
            setCallData(data);
          });
        } else {
          console.warn('🚫 Permissions not granted');
        }
      } catch (err) {
        console.error('⚠️ Error requesting permissions:', err);
      }
    };

    requestPermissions();

    return () => {
      if (subscription) {
        subscription.remove(); // ✅ Safely remove if it exists
        console.log('🧹 Event listener cleaned up');
      }
    };
  }, []);

  const requestDefaultDialer = async () => {
    try {
      await NativeModules.CallModule.askToBeDefaultDialer();
      console.log('📱 Default dialer request sent');
    } catch (error) {
      console.log('❌ Default dialer request error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>📲 Call Detection App</Text>

      <TouchableOpacity
        onPress={requestDefaultDialer}
        style={{
          backgroundColor: 'teal',
          padding: 10,
          borderRadius: 8,
          marginVertical: 10,
        }}>
        <Text style={{ color: 'white', fontSize: 20 }}>
          Tap to set as default dialer
        </Text>
      </TouchableOpacity>

      <Text>👋 Hello!</Text>
      {callData && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>📞 Incoming Call: {callData}</Text>
      )}
    </View>
  );
};

export default App;
