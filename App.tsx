/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MotiSkeletonScreen from './app/screens/MotiSkeletonScreen';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView>
        <MotiSkeletonScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
