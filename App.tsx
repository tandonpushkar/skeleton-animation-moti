/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import SwipeableScreen from './app/screens/SwipeableScreen';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>

        <View>
         <SwipeableScreen/>
        </View>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
