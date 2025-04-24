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
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux';
import { store } from './src/state/store';

const App = () => {
  const [callData, setCallData] = useState<string | null>(null);

  useEffect(() => {
    const requestAllPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const overlayGranted = await NativeModules.CallModule.requestOverlayPermission();
          console.log('🧩 Overlay permission handled:', overlayGranted);
        }
  
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to avoid clash
  
        
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          // PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS, // Add if needed
        ]);
  
        if (
          granted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_CALL_LOG'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('✅ All permissions granted');
  
          const eventEmitter = new NativeEventEmitter(NativeModules.CallModule);
          const subscription = eventEmitter.addListener('IncomingCall', (data) => {
            console.log('📞 Incoming call detected:', data);
            setCallData(data);
          });
  
          return () => {
            subscription.remove();
          };
        } else {
          console.warn('🚫 Some permissions not granted');
        }
  
      } catch (err) {
        console.error('⚠️ Error during permission flow:', err);
      }
    };
  
    requestAllPermissions();
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
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
};

export default App;
