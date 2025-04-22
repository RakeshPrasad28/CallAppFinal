import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Image, TextStyle, View, ViewStyle} from 'react-native';
import {Colors} from '../../utils/Constants';
import {fontR} from '../../utils/Scaling';
import {FC} from 'react';
import CustomText from '../../components/CustomText';

interface TabProps {
  name: string;
}
interface IconProp {
  focused: boolean;
}

const styles = {
  width: RFValue(18),
  height: RFValue(18),
};

const tabStyles: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};
const textStyleInActive: TextStyle = {
  textAlign: 'center',
  marginTop: 4,
  color: "black",
  fontSize: fontR(9.5),
  opacity:0.7
};
const textStyleActive: TextStyle = {
  textAlign: 'center',
  marginTop: 4,
  color: Colors.tabTextColor,
  fontSize: fontR(9.5),
};

const TabIcon: FC<TabProps> = ({name}) => {
  return (
    <View style={tabStyles}>
      {name === 'Home' ? (
        <Ionicons name="call-outline" size={RFValue(18)} color="black" style={{opacity:0.6}}/>
      ):
       (
        <Ionicons name="settings-outline" size={RFValue(18)} color="black" style={{opacity:0.6}}/>
      )}
      <CustomText style={textStyleInActive}>{name}</CustomText>
    </View>
  );
};

const TabIconFocused: FC<TabProps> = ({name}) => {
  return (
    <View style={tabStyles}>
      {name === 'Home' ? (
        <Ionicons name="call" size={RFValue(18)} color="blue" />
      ) :
       (
        <Ionicons name="settings" size={RFValue(18)} color="blue" />
      )}
      <CustomText style={textStyleActive} fontFamily="Satoshi-Bold">
        {name}
      </CustomText>
    </View>
  );
};

export const HomeTabIcon: FC<IconProp> = ({focused}) => {
  return focused ? (
    <TabIconFocused name="Home" />
  ) : (
    <TabIcon name="Home" />
  );
};


export const SettingsTabIcon: FC<IconProp> = ({focused}) => {
  return focused ? (
    <TabIconFocused name="Settings" />
  ) : (
    <TabIcon name="Settings" />
  );
};

