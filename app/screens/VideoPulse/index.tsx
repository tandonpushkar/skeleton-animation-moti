import {MotiView} from 'moti';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Easing} from 'react-native-reanimated';

const VideoPulse = () => {
  return (
    <View style={styles.mainView}>
      <View style={styles.circle}>
        {[...Array(3).keys()].map(index => {
          return (
            <MotiView
              from={{opacity: 0.7, scale: 1}}
              animate={{opacity: 0, scale: 4}}
              transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.out(Easing.ease),
                delay: index * 400,
                loop: true,
                repeatReverse: false,
              }}
              key={index}
              style={[StyleSheet.absoluteFillObject, styles.circle]}
            />
          );
        })}
        <Image
          tintColor={'#FFF'}
          source={require('../../assets/play-solid.png')}
          style={styles.imageStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {width: 25, height: 25},
  circle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#54C856',
  },
  mainView: {height: '100%', justifyContent: 'center', alignItems: 'center'},
});

export default VideoPulse;
