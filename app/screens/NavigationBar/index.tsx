import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Images} from '../../assets';
import {MotiView, useDynamicAnimation, useAnimationState} from 'moti';

const windowWidth = Dimensions.get('window').width
const eachWidthNo = windowWidth/4

const deviceWidth = eachWidthNo*4
const deviceHeight = Dimensions.get('window').height;

const useTranslateX = () => {
  return useAnimationState({
    from: {translateX: 0},
    to0: {translateX: 0},
    to1: {translateX: deviceWidth / 4},
    to2: {translateX: (deviceWidth / 4) * 2},
    to3: {translateX: (deviceWidth / 4) * 3},
  });
};
const footerIconsArray = [Images.img1, Images.img2, Images.img3, Images.img4];
type ImageSource = ReturnType<typeof Images.img1>;

const NavigationBar: React.FC = () => {
  const translateXState = useTranslateX();
  const [image, setImage] = useState<ImageSource>(Images.img1);

  const animations = Array(4)
    .fill(null)
    .map((_, index) =>
      useDynamicAnimation(() => ({
        opacity: 1,
        translateY: index === 0 ? -15 : 0,
      })),
    );

  const handlePress = (index: number, img: ImageSource, code: string | any) => {
    animations.forEach((anim, i) => {
      anim.animateTo({
        opacity: 1,
        translateY: i === index ? -15 : 0,
      });
    });

    translateXState.transitionTo(code);
    setImage(img);
  };

  return (
    <View style={{height: '100%'}}>
      <View style={{height: '90%'}}>
        <Image
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
          source={require('../../assets/Home.png')}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.navBar}>
          {footerIconsArray.map((img, index) => (
            <Pressable
              key={index}
              onPress={() => handlePress(index, img, `to${index}`)}
              style={styles.pressable}
              hitSlop={styles.hitSlop}>
              <MotiView state={animations[index]}>
                <Image
                  tintColor={image === img ? 'black' : '#A6A6A6'}
                  resizeMode="contain"
                  style={styles.icon}
                  source={img}
                />
              </MotiView>
            </Pressable>
          ))}
          <MotiView
            state={translateXState}
            style={styles.translateXmainContainer}>
            <Image
              resizeMode="contain"
              style={styles.bgImage}
              source={Images.bg1}
            />
            <View style={styles.imageCircle} />
          </MotiView>
        </View>
      </View>
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    height: '10%',
  },
  navBar: {

    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: '#212121',
    width: deviceWidth,
    height: Platform.OS === 'android' ?  75 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  pressable: {
    paddingHorizontal: 20,
    width: eachWidthNo,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
  },
  translateXmainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    position: 'absolute',

  },
  bgImage: {
    width: eachWidthNo,
    height: eachWidthNo/2 + 3,
  },
  imageCircle: {
    bottom: 10,
    width: 56,
    height: 56,
    backgroundColor: '#61DA5F',
    borderRadius: 28,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitSlop: {bottom: 20, left: 20, right: 20, top: 20},
});
