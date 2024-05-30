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
import VideoPulse from './app/screens/VideoPulse';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView>
        {/* <MotiSkeletonScreen /> */}
        <VideoPulse/>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
