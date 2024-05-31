/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NavigationBar from './app/screens/NavigationBar';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1 , backgroundColor: '#121212'}}>
      <SafeAreaView>
        <View>
          <NavigationBar/>
         
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
