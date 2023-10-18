import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AllList from '../screens/AllList';
import WatchedList from '../screens/WatchedList';
import {appColors} from '../dummyData/appColors';

const Tab = createBottomTabNavigator();

export const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="all"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 2,
          backgroundColor: appColors.primary,
          height: 64,
        },
        tabBarLabelStyle: {
          marginBottom: 10,
          fontSize: 14,
        },
        tabBarActiveTintColor: appColors.secoundry,
      }}>
      <Tab.Screen
        name="All Movies"
        component={AllList}
        options={{
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({focused}) => (
            <Icon
              name="film-outline"
              size={35}
              color={focused ? appColors.secoundry : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Watched List"
        component={WatchedList}
        options={{
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({focused}) => (
            <Icon
              name="caret-back-circle-outline"
              size={35}
              color={focused ? appColors.secoundry : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
