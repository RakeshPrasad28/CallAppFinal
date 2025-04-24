import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import CallLogs from 'react-native-call-log';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCallLogs,
  appendCallLogs,
  setLoading,
  setSelectedFilter,
  setMinTimestamp,
} from '../state/slice/callLogSlice';
import {RootState} from '../state/store';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from './Icon';
import moment from 'moment';
import {navigate} from '../utils/NavigationUtils';
import Search from './Search';

const CallLogScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {callLogs, selectedFilter, isLoading, minTimestamp} = useSelector(
    (state: RootState) => state.callLogs,
  );

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const formatDate = (dateTime: string) => {
    const date = moment(dateTime, 'DD-MMM-YYYY hh:mm:ss a');
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) return date.format('h:mm A');
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    return date.format('DD-MMM-YYYY');
  };

  // Function to fetch call logs
  const fetchCallLogs = async (): Promise<void> => {
    try {
      if (isFetching) return;

      setIsFetching(true);

      // Set the filter for pagination
      const filter: any = {};
      if (minTimestamp !== null) {
        filter['maxTimestamp'] = minTimestamp - 1; 
      }

      const logs = await CallLogs.load(20, filter); // Load 20 records

      const filteredLogs = logs.filter((log: any) => {
        if (selectedFilter === 'ALL') return true;
        return log.type === selectedFilter;
      });

      if (minTimestamp === null) {
        dispatch(setCallLogs(filteredLogs));
      } else {
        // Append the new logs
        dispatch(appendCallLogs(filteredLogs));
      }

      // Update minTimestamp to the last timestamp of the fetched logs for pagination
      if (logs.length > 0) {
        const newMinTimestamp = Math.min(
          ...logs.map((log: any) => log.timestamp),
        );
        dispatch(setMinTimestamp(newMinTimestamp));
      }
    } catch (err) {
      console.error('Error fetching call logs:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, [minTimestamp, selectedFilter]);

  const handleEndReached = () => {
    if (!isFetching) {
      fetchCallLogs();
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() =>
        navigate('PersonCallLogs', {
          item: item,
        })
      }
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#000',
          }}
        />
        <View>
          <Text style={{fontSize: RFValue(18)}}>
            {item.name || item.phoneNumber}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            {item?.type === 'MISSED' && (
              <Icon
                name="call-missed"
                iconFamily="MaterialIcons"
                color="red"
                size={RFValue(14)}
              />
            )}
            {item?.type === 'INCOMING' && (
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
            )}
            {item?.type === 'UNKNOWN' && (
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
            )}
            {item?.type === 'OUTGOING' && (
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
            )}
            <Text>{formatDate(item?.dateTime)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // KeyExtractor
  const getKey = (item: any): string => `${item.phoneNumber}_${item.timestamp}`;

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuVisible(prev => !prev);
  }, []);

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Search onToggleMenu={toggleMenu} />
      {isMenuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={styles.overlay}>
          <View style={styles.modalPosition}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'INCOMING'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Incoming Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'OUTGOING'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Outgoing Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'MISSED'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="call-missed"
                iconFamily="MaterialIcons"
                color="red"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Missed Calls</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {isLoading && <ActivityIndicator size="large" />}

      <FlatList
        data={callLogs}
        renderItem={renderItem}
        keyExtractor={getKey}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isFetching && <Text>Loading more...</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalPosition: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  modalText: {
    fontSize: RFValue(18),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 9,
    pointerEvents: 'box-none',
  },
});

export default CallLogScreen;
