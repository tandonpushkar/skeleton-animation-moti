import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from 'react-native-reanimated';
import Svg, { Path as SvgPath, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 60;
const ICON_SIZE = 28;

const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent1: '#e74c3c',
  accent2: '#f39c12',
  background: 'black',
  text: '#2c3e50',
  white: '#ffffff',
};

const GRADIENTS = [
  [COLORS.primary, COLORS.secondary],
  [COLORS.accent1, COLORS.accent2],
  [COLORS.secondary, COLORS.primary],
  [COLORS.accent2, COLORS.secondary],
];

const CartIcon = () => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
    <SvgPath
      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 16M17 13L19.3 16M19.3 16H4.7M19.3 16L21 19H3L4.7 16"
      stroke={COLORS.white}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckMark = () => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" stroke={COLORS.white} strokeWidth="2" />
    <SvgPath
      d="M8 12L11 15L16 9"
      stroke={COLORS.white}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AnimatedButton = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(GRADIENTS[0]);
  const progress = useSharedValue(0);
  const centerY = useSharedValue(BUTTON_HEIGHT / 2);

  const handleAnimationComplete = useCallback(() => {
    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(false);
      progress.value = withTiming(0, { duration: 600 });
    }, 2000);
  }, [progress]);

  const handlePress = useCallback(() => {
    if (!isCompleted) {
      setCurrentGradient(GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);
      progress.value = withSpring(1, { damping: 12, stiffness: 100, duration: 1000 }, () => {
        runOnJS(handleAnimationComplete)();
      });
    }
  }, [isCompleted, progress, handleAnimationComplete]);

  const animatedWidth = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [BUTTON_WIDTH, BUTTON_HEIGHT]);
  });

  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, 0);
    
    for (let i = 0; i <= BUTTON_WIDTH; i += 5) {
      const x = i;
      const y = Math.sin((i / BUTTON_WIDTH) * Math.PI * 2 + progress.value * Math.PI * 2) * 10;
      p.lineTo(x, centerY.value + y);
    }
    
    p.lineTo(BUTTON_WIDTH, BUTTON_HEIGHT);
    p.lineTo(0, BUTTON_HEIGHT);
    p.close();
    
    return p;
  });

  const buttonStyle = useAnimatedStyle(() => ({
    width: animatedWidth.value,
    height: BUTTON_HEIGHT,
    transform: [{ scale: interpolate(progress.value, [0, 0.4, 1], [1, 0.95, 1]) }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [1, 0], Extrapolate.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0, 0.2], [1, 0], Extrapolate.CLAMP) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.8, 1], [0, 1], Extrapolate.CLAMP),
    transform: [
      { scale: interpolate(progress.value, [0.8, 1], [0, 1], Extrapolate.CLAMP) },
    ],
  }));

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Group>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(BUTTON_WIDTH, BUTTON_HEIGHT)}
                colors={currentGradient}
              />
              <Path path={path} />
            </Group>
          </Canvas>
          <Animated.View style={[styles.contentContainer, textStyle]}>
            <Animated.Text style={styles.buttonText}>Add to Cart</Animated.Text>
          </Animated.View>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            {isCompleted ? <CheckMark /> : <CartIcon />}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: COLORS.background,
  },
  buttonContainer: {
    height: BUTTON_HEIGHT,
    overflow: 'hidden',
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
});

export default AnimatedButton;