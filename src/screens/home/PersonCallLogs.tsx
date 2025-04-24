import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useSelector} from 'react-redux';
import {selectCallLogsByPhoneNumber} from '../../state/slice/callLogSlice';
import Icon from '../../components/Icon';
import moment from 'moment';
import { goBack } from '../../utils/NavigationUtils';

const PersonCallLogs = () => {
  const route = useRoute();
  const {item} = route?.params || {};

  const logsForNumber = useSelector(state =>
    selectCallLogsByPhoneNumber(state, item?.phoneNumber),
  );

  const formatDate = (dateTime: string) => {
    const date = moment(dateTime, 'DD-MMM-YYYY hh:mm:ss a');
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) return date.format('h:mm A');
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    return date.format('DD-MMM-YYYY');
  };

  const formatTime = (seconds: number): string => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${String(minutes).padStart(2, '0')}:${String(
        remainingSeconds,
      ).padStart(2, '0')}`;
    }

    return `${seconds}s`;
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.callLogContainer}>
        <View style={styles.callLogInfo}>
          {item?.type === 'MISSED' && (
            <Icon
              name="call-missed"
              iconFamily="MaterialIcons"
              color="red"
              size={RFValue(18)}
            />
          )}
          {item?.type === 'INCOMING'  && (
            <Icon
              name="arrow-bottom-left"
              iconFamily="MaterialCommunityIcons"
              color="green"
              size={RFValue(18)}
            />
          )}
          {item?.type === 'UNKNOWN'  && (
            <Icon
              name="arrow-bottom-left"
              iconFamily="MaterialCommunityIcons"
              color="green"
              size={RFValue(18)}
            />
          )}
          {item?.type === 'OUTGOING' && (
            <Icon
              name="arrow-top-right"
              iconFamily="MaterialCommunityIcons"
              color="blue"
              size={RFValue(18)}
            />
          )}
          <View style={styles.callLogText}>
            <Text style={styles.dateText}>{formatDate(item?.dateTime)}</Text>
            <Text style={styles.typeText}>{item?.type==='UNKNOWN'?'INCOMING':item?.type}</Text>
          </View>
        </View>
        <Text style={styles.durationText}>
          {item?.duration ? formatTime(item?.duration) : null}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Pressable onPress={() => goBack()} style={{alignSelf:"flex-start"}}>
        <Icon
          name="arrow-back-sharp"
          iconFamily="Ionicons"
          size={RFValue(24)}
          color="#000"
        />
      </Pressable>
        <View style={styles.avatarContainer} />
        {item?.name ? (
          <Text style={styles.nameText}>{item?.name}</Text>
        ) : (
          <Text style={styles.nameText}>{item?.phoneNumber}</Text>
        )}
      </View>
      <FlatList
        data={logsForNumber}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.dateTime}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    marginBottom: 10,
  },
  nameText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: '#333',
  },
  callLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callLogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  callLogText: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: RFValue(16),
    color: '#555',
  },
  typeText: {
    fontSize: RFValue(14),
    color: '#888',
  },
  durationText: {
    fontSize: RFValue(14),
    color: '#333',
    fontWeight: '500',
  },
});

export default PersonCallLogs;
