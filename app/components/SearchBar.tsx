import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, TextInput, Dimensions, View, Image, TouchableOpacity, Pressable, Alert} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
  withSequence,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import ProductModal from './ProductModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SEARCH_ICON_SIZE = 50;
const EXPANDED_WIDTH = SCREEN_WIDTH - 20;
const BASE_COLOR = 'rgba(255, 63, 108, 0.8)';  
const GRADIENT_START = 'rgba(253, 241, 244, 1)'; 
const GRADIENT_END = 'rgba(255, 63, 108, 0.9)'; 
const ICON_COLOR = 'rgba(255, 255, 255, 1)'; 
const RIPPLE_COLOR = 'rgba(255, 63, 108, 0.2)'; 

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const progress = useSharedValue(0);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const ripple3 = useSharedValue(0);

  const toggleExpansion = () => {
    if (isExpanded && inputRef.current) {
      inputRef.current.blur();
    }
    progress.value = withTiming(isExpanded ? 0 : 1, {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    if (!isExpanded) {
      ripple1.value = withRepeat(withSequence(
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 1000 })
      ), -1, true);
      ripple2.value = withDelay(333, withRepeat(withSequence(
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 1000 })
      ), -1, true));
      ripple3.value = withDelay(666, withRepeat(withSequence(
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0, { duration: 1000 })
      ), -1, true));
    } else {
      ripple1.value = 0;
      ripple2.value = 0;
      ripple3.value = 0;
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: progress.value * EXPANDED_WIDTH + (1 - progress.value) * SEARCH_ICON_SIZE,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [BASE_COLOR, 'rgba(253, 241, 244, 0.95)']
      ),
    };
  });

  const createRippleStyle = (ripple: Animated.SharedValue<number>) => useAnimatedStyle(() => {
    return {
      width: SEARCH_ICON_SIZE + ripple.value * (EXPANDED_WIDTH - SEARCH_ICON_SIZE),
      height: SEARCH_ICON_SIZE + ripple.value * (SEARCH_ICON_SIZE / 2),
      borderRadius: (SEARCH_ICON_SIZE + ripple.value * (EXPANDED_WIDTH - SEARCH_ICON_SIZE)) / 2,
      opacity: 0.8 - ripple.value * 0.5,
      transform: [{ scale: 1 + ripple.value * 0.2 }],
    };
  });

  const rippleStyle1 = createRippleStyle(ripple1);
  const rippleStyle2 = createRippleStyle(ripple2);
  const rippleStyle3 = createRippleStyle(ripple3);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setShowModal(text.length > 0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchText('');
    toggleExpansion();
  };

  const handleProductSelect = () => {
    setShowModal(false);
    setSearchText('');
    setIsExpanded(false);
    progress.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
    ripple1.value = 0;
    ripple2.value = 0;
    ripple3.value = 0;
  };

  return (
    <Pressable onPress={toggleExpansion}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={[GRADIENT_START, GRADIENT_END]}
          style={StyleSheet.absoluteFill}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
        <Animated.View style={[styles.ripple, rippleStyle1]} />
        <Animated.View style={[styles.ripple, rippleStyle2]} />
        <Animated.View style={[styles.ripple, rippleStyle3]} />
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Image
              source={require('../assets/search.png')}
              style={styles.searchIcon}
            />
          </View>
        </View>
        {isExpanded && (
          <>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="rgba(0,0,0,0.5)"
              //onBlur={toggleExpansion}
              value={searchText}
              onChangeText={handleTextChange}
            />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Image
                source={require('../assets/cross.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      <ProductModal 
        visible={showModal} 
        onClose={handleCloseModal} 
        onProductSelect={handleProductSelect}
        searchText={searchText} 
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: SEARCH_ICON_SIZE,
    borderRadius: SEARCH_ICON_SIZE / 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: RIPPLE_COLOR,
  },
  iconContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SEARCH_ICON_SIZE,
    height: SEARCH_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconBackground: {
    width: SEARCH_ICON_SIZE - 4,
    height: SEARCH_ICON_SIZE - 4,
    borderRadius: (SEARCH_ICON_SIZE - 4) / 2,
    backgroundColor: BASE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: SEARCH_ICON_SIZE * 0.6,
    height: SEARCH_ICON_SIZE * 0.6,
    tintColor: ICON_COLOR,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingLeft: SEARCH_ICON_SIZE + 5,
    paddingRight: SEARCH_ICON_SIZE,
    fontSize: 16,
    color: 'rgba(40, 44, 63, 0.9)', 
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: SEARCH_ICON_SIZE,
    height: SEARCH_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: SEARCH_ICON_SIZE * 0.4,
    height: SEARCH_ICON_SIZE * 0.4,
    tintColor: ICON_COLOR,
  },
});

export default SearchBar;