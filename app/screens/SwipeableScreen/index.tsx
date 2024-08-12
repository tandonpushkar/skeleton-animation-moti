import {AnimatePresence, Image, MotiView, SafeAreaView} from 'moti';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  Easing,
  ReduceMotion,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {Images} from '../../assets';
import {
  Canvas,
  LinearGradient,
  RadialGradient,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const screenCount = 3;
const totalScreens = screenCount + 2; // Total screens including duplicates

const Screen = ({ bottleImage, backgroundImage, text}) => {
  return (
    <View style={[styles.screen]}>
      <MotiView
        animate={{
          scale: [1, 0.9, 0.8, 0.9, 1], // scale to 0, 1.1, then 1 (with delay 200 ms)
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 10,
        }}
        style={{bottom: 0, position: 'absolute', width: 450, height: 660}}>
        <Image
          resizeMode="contain"
          style={{bottom: 0, position: 'absolute', width: 450, height: 660}}
          source={bottleImage}
        />
      </MotiView>

      <MotiView
        from={{
          scale: 1.1,
        }}
        animate={{
          scale: [1.1, {value: 0, delay: 500}], // scale to 0, 1.1, then 1 (with delay 200 ms)
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 10,
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          width: 450,
          height: height,
        }}>
        <Image
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
          source={backgroundImage}
        />
      </MotiView>
    </View>
  );
};

const SwipeableScreen = () => {
  const translateX = useSharedValue(-width);
  const prevTranslationX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const leftColor = useSharedValue('#FFEE57');
  const rightColor = useSharedValue('#FFB930');
  const [currentScreen, setCurrentScreen] = useState(0);

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);

  const onDrag = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translateX.value;
    })
    .onUpdate(event => {
      translateX.value = prevTranslationX.value + event.translationX;
    })
    .onEnd(event => {
      const offset = Math.round(event.translationX / width);
      let newIndex = currentIndex.value - offset;

      if (newIndex < 0) {
        newIndex = screenCount - 1;
        translateX.value = -width * (newIndex + 1);
      } else if (newIndex >= screenCount) {
        newIndex = 0;
        translateX.value = -width * (newIndex + 1);
      } else {
        translateX.value = withTiming(-width * (newIndex + 1), {duration: 300});
      }

      if (newIndex === 0) {
        leftColor.value = withTiming('#FFEE57', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
        rightColor.value = withTiming('#FFB930', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
      } else if (newIndex === 1) {
        leftColor.value = withTiming('#BCDB4E', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
        rightColor.value = withTiming('#8EC648', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
      } else {
        leftColor.value = withTiming('#AE4EDB', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
        rightColor.value = withTiming('#6848C6', {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          reduceMotion: ReduceMotion.System,
        });
      }
      runOnJS(setCurrentScreen)(newIndex);
      currentIndex.value = newIndex;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <>
      <Canvas style={{position: 'absolute', height: height, width: '100%'}}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={width}
            // start={vec(0, 0)}
            // end={vec(width, height)}
            colors={colors}
          />
        </Rect>
      </Canvas>
      <GestureDetector gesture={onDrag}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Screen
            bottleImage={Images.bottle3}
            backgroundImage={Images.bg_3}
            text="Screen 3"
          />
          <Screen
          
            bottleImage={Images.bottle1}
            backgroundImage={Images.bg_1}
            text="Screen 1"
          />
          <Screen
          
            bottleImage={Images.bottle2}
            backgroundImage={Images.bg_2}
            text="Screen 2"
          />
          <Screen
            bottleImage={Images.bottle3}
            backgroundImage={Images.bg_3}
            text="Screen 3"
          />
          <Screen
            bottleImage={Images.bottle1}
            backgroundImage={Images.bg_1}
            text="Screen 1"
          />
        </Animated.View>
      </GestureDetector>
      <View
        style={{
          height: 52,
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          style={{height: '100%', width: 180}}
          source={Images.logo}
        />
      </View>

      <View
        style={{
          height: 52,
          position: 'absolute',
          top: '85%',
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 180,
            height: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MotiView
          //style={{backgroundColor: 'red'}}
            from={{

              scale: 1,
            }}
            animate={{
              borderWidth: currentScreen === 0 ? 2: 0,
              borderColor: 'white',
              borderRadius: 22,
              scale: currentScreen === 0 ? 2 : 1,
            }}>
            <Image
              resizeMode="contain"
              style={{ height: 22 , width: 22}}
              source={Images.fruit_1}
            />
          </MotiView>
          <MotiView
            from={{
              scale: 1,
            }}
            animate={{
              borderWidth: currentScreen === 1 ? 2: 0,
              borderColor: 'white',
              borderRadius: 22,
              scale: currentScreen === 1 ? 2 : 1,
            }}>
          <Image
            resizeMode="contain"
            style={{ height: 22 , width: 22}}
            source={Images.fruit_2}
          />
          </MotiView>
          <MotiView
            from={{
              scale: 1,
            }}
            animate={{
              borderWidth: currentScreen === 2 ? 2: 0,
              borderColor: 'white',
              borderRadius: 22,
              scale: currentScreen === 2 ? 2 : 1,
            }}>
          <Image
            resizeMode="contain"
            style={{ height: 22 , width: 22}}
            source={Images.fruit_3}
          />
          </MotiView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'row',
    width: width * totalScreens, // Width for five screens
  },
  screen: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});

export default SwipeableScreen;
