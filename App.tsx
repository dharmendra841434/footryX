import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {appColors} from './src/dummyData/appColors';
import StackNavigation from './src/navigations/StackNavigation';

const App = () => {
  return (
    <View style={{flex: 1, backgroundColor: appColors.primary}}>
      <StatusBar backgroundColor={appColors.primary} barStyle="light-content" />
      <StackNavigation />
    </View>
  );
};

export default App;
