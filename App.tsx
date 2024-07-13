import React, {useState, useMemo} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MotiView} from 'moti';
import {Images} from './app/assets';

const commonTransition: any = {type: 'timing', duration: 1000};
const DELAYS = {
  CIRCLE_OPACITY: 2000,
  CIRCLE_SCALE: 4300,
  TRANSLATE_X: 5000,
  SCALE_DELAY: 3000,
};

interface CircleAnimationProps {
  isVisible: boolean;
}

const CircleAnimation: React.FC<CircleAnimationProps> = ({isVisible}) => (
  <MotiView
    transition={commonTransition}
    animate={{
      opacity: [0, {value: isVisible ? 0 : 1, delay: DELAYS.CIRCLE_OPACITY}],
      scale: [1, {value: isVisible ? 1 : 2.5, delay: DELAYS.CIRCLE_SCALE}],
    }}>
    <ImageBackground source={Images.circle} style={styles.circle}>
      <Image source={Images.tick} style={styles.tick} />
    </ImageBackground>
  </MotiView>
);

interface BoxAnimationProps {
  isVisible: boolean;
  screenHeight: number;
}

const BoxAnimation: React.FC<BoxAnimationProps> = ({
  isVisible,
  screenHeight,
}) => (
  <MotiView
    transition={{type: 'timing'}}
    animate={{
      translateX: [0, {value: isVisible ? 0 : 320, delay: DELAYS.TRANSLATE_X}],
      scale: [1.1, {value: isVisible ? 1.1 : 0.8, delay: DELAYS.SCALE_DELAY}],
    }}
    style={styles.zIndex3}>
    <MotiView
      style={styles.boxUpWrapper}
      transition={commonTransition}
      animate={{
        translateY: isVisible ? 0 : 500,
        scale: [isVisible ? 0.7 : 1.1, 1, 1.1],
      }}>
      <Image resizeMode="contain" source={Images.box_up} style={styles.boxUp} />
    </MotiView>
    <MotiView
      style={styles.boxDownWrapper}
      transition={commonTransition}
      animate={{
        translateY: isVisible ? screenHeight : 350,
        scale: [isVisible ? 0.7 : 1.1, 1, 1.1],
      }}>
      <Image
        resizeMode="contain"
        source={Images.box_down}
        style={styles.boxDown}
      />
    </MotiView>
  </MotiView>
);

const HeaderImage: React.FC = () => (
  <Image resizeMode="contain" source={Images.header} style={styles.header} />
);

interface BearAnimationProps {
  isVisible: boolean;
}

const BearAnimation: React.FC<BearAnimationProps> = ({isVisible}) => (
  <MotiView
    transition={commonTransition}
    animate={{
      translateY: isVisible ? 0 : 200,
      scale: [isVisible ? 1 : 0.5, {value: isVisible ? 1 : 0, delay: 1000}],
    }}>
    <Image resizeMode="contain" source={Images.bear} style={styles.bear} />
  </MotiView>
);

interface ContentProps {
  isVisible: boolean;
  handlePress: () => void;
}

const Content: React.FC<ContentProps> = ({isVisible, handlePress}) => (
  <MotiView
    animate={{opacity: isVisible ? 1 : 0}}
    transition={commonTransition}
    style={styles.content}>
    <Image resizeMode="contain" source={Images.text_1} style={styles.text1} />
    <Image resizeMode="contain" source={Images.text_2} style={styles.text2} />
    <TouchableOpacity onPress={handlePress}>
      <Image
        resizeMode="contain"
        source={Images.add_btn}
        style={styles.addButton}
      />
    </TouchableOpacity>
  </MotiView>
);

const App: React.FC = () => {
  const {height: screenHeight} = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);

  const handlePress = () => {
    setIsVisible(false);
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CircleAnimation isVisible={isVisible} />
          <BoxAnimation isVisible={isVisible} screenHeight={screenHeight} />
          <HeaderImage />
          <BearAnimation isVisible={isVisible} />
          <Content isVisible={isVisible} handlePress={handlePress} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#E1CFD5',
  },
  container: {
    height: '100%',
    backgroundColor: '#E1CFD5',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: 100,
    width: 76,
    height: 76,
    position: 'absolute',
  },
  tick: {
    width: 42,
    height: 42,
  },
  zIndex3: {
    zIndex: 3,
  },
  boxUpWrapper: {
    zIndex: 2,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  boxUp: {
    alignSelf: 'center',
    height: 250,
  },
  boxDownWrapper: {
    zIndex: 1,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  boxDown: {
    alignSelf: 'center',
    height: 250,
  },
  header: {
    marginTop: 16,
    alignSelf: 'center',
    height: 46,
    width: '90%',
  },
  bear: {
    marginTop: 16,
    alignSelf: 'center',
    height: 400,
  },
  content: {
    borderTopRightRadius: 160,
    height: '100%',
    backgroundColor: '#F0E7EA',
    marginTop: 50,
    padding: 24,
    rowGap: 32,
  },
  text1: {
    height: 50,
    width: 180,
  },
  text2: {
    height: 28,
    width: 326,
  },
  addButton: {
    height: 56,
    width: 326,
  },
});

export default App;
