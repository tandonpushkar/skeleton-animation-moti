import {AnimatePresence, Image, MotiView, SafeAreaView} from 'moti';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  ReduceMotion,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import {Images} from '../../assets';
import {Canvas, RadialGradient, Rect, vec} from '@shopify/react-native-skia';

const {width, height} = Dimensions.get('screen');
const screenCount = 3;
const totalScreens = screenCount + 2; // Total screens including duplicates

const BottleImage = ({bottleImage}: any) => (
  <MotiView
    animate={{
      scale: [1, 0.9, 0.8, 0.9, 1],
    }}
    transition={{
      type: 'spring',
      stiffness: 150,
      damping: 10,
    }}
    style={styles.bottleImage}>
    <Image
      resizeMode="contain"
      style={styles.bottleImage}
      source={bottleImage}
    />
  </MotiView>
);

const BackgroundImage = ({backgroundImage}: any) => (
  <MotiView
    from={{scale: 1.1}}
    animate={{scale: [1.1, {value: 0, delay: 500}]}}
    transition={{
      type: 'spring',
      stiffness: 150,
      damping: 10,
    }}
    style={styles.backgroundImage}>
    <Image
      resizeMode="contain"
      style={styles.fullSize}
      source={backgroundImage}
    />
  </MotiView>
);

const Screen = ({bottleImage, backgroundImage}: any) => (
  <View style={styles.screen}>
    <BottleImage bottleImage={bottleImage} />
    <BackgroundImage backgroundImage={backgroundImage} />
  </View>
);

const FruitIcon = ({imageSource, isActive}: any) => (
  <MotiView
    from={{scale: 1}}
    animate={{
      borderWidth: isActive ? 2 : 0,
      borderColor: 'white',
      borderRadius: 22,
      scale: isActive ? 2 : 1,
    }}>
    <Image resizeMode="contain" style={styles.fruitIcon} source={imageSource} />
  </MotiView>
);

const SwipeableScreen = () => {
  const translateX = useSharedValue(-width);
  const prevTranslationX = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const leftColor = useSharedValue('#FFEE57');
  const rightColor = useSharedValue('#FFB930');
  const [currentScreen, setCurrentScreen] = useState(0);

  const colors = useDerivedValue(() => [leftColor.value, rightColor.value], []);

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

      const colorMap = [
        {left: '#FFEE57', right: '#FFB930'},
        {left: '#BCDB4E', right: '#8EC648'},
        {left: '#AE4EDB', right: '#6848C6'},
      ];

      leftColor.value = withTiming(colorMap[newIndex].left, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
      rightColor.value = withTiming(colorMap[newIndex].right, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });

      runOnJS(setCurrentScreen)(newIndex);
      currentIndex.value = newIndex;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <>
      <Canvas style={styles.absoluteFull}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={width}
            colors={colors}
          />
        </Rect>
      </Canvas>
      <GestureDetector gesture={onDrag}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Screen bottleImage={Images.bottle3} backgroundImage={Images.bg_3} />
          <Screen bottleImage={Images.bottle1} backgroundImage={Images.bg_1} />
          <Screen bottleImage={Images.bottle2} backgroundImage={Images.bg_2} />
          <Screen bottleImage={Images.bottle3} backgroundImage={Images.bg_3} />
          <Screen bottleImage={Images.bottle1} backgroundImage={Images.bg_1} />
        </Animated.View>
      </GestureDetector>
      <View style={styles.logoContainer}>
        <Image resizeMode="contain" style={styles.logo} source={Images.logo} />
      </View>
      <View style={styles.fruitContainer}>
        <View style={styles.fruitRow}>
          <FruitIcon
            imageSource={Images.fruit_1}
            isActive={currentScreen === 0}
          />
          <FruitIcon
            imageSource={Images.fruit_2}
            isActive={currentScreen === 1}
          />
          <FruitIcon
            imageSource={Images.fruit_3}
            isActive={currentScreen === 2}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'row',
    width: width * totalScreens,
  },
  screen: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottleImage: {
    bottom: 0,
    position: 'absolute',
    width: 450,
    height: 660,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: 450,
    height: height,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    height: 52,
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    height: '100%',
    width: 180,
  },
  fruitContainer: {
    height: 52,
    position: 'absolute',
    top: '85%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fruitRow: {
    width: 180,
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fruitIcon: {
    height: 22,
    width: 22,
  },
  absoluteFull: {
    position: 'absolute',
    height: height,
    width: '100%',
  },
});

export default SwipeableScreen;
