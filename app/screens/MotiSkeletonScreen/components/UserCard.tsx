import React, { memo } from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {Skeleton} from 'moti/skeleton';
import Animated, {
  FadeIn,
  LinearTransition,
  SlideInLeft,
} from 'react-native-reanimated';

const SkeletonCommonProps: any = {
  transition: {type: 'timing', duration: 2000},
  colorMode: 'light',
  backgroundColor: '#D4D4D4',
};

const AnimationCommonProps: any = {
  layout: LinearTransition,
  entering: FadeIn.delay(100).duration(1500),
};

const UserCard = ({item, title, description, imageUrl, country = ''}: any) => {
  return (
    <View style={styles.card}>
      <Skeleton.Group show={item == null}>
        <View style={styles.mainView}>
          <Skeleton width={80} height={80} {...SkeletonCommonProps}>
            {item && (
              <Animated.Image
                layout={LinearTransition}
                entering={SlideInLeft.delay(100).duration(1500)}
                resizeMode="contain"
                source={{uri: imageUrl}}
                style={styles.cardImage}
              />
            )}
          </Skeleton>
          <View style={{rowGap: 5, padding: 8}}>
            <Skeleton width={'80%'} height={22} {...SkeletonCommonProps}>
              {item && (
                <Animated.Text
                  {...AnimationCommonProps}
                  style={styles.cardTitle}>
                  {title}
                </Animated.Text>
              )}
            </Skeleton>
            <Skeleton width={'50%'} height={22} {...SkeletonCommonProps}>
              {item && (
                <Animated.Text
                  {...AnimationCommonProps}
                  style={styles.countryTitle}>
                  {country}
                </Animated.Text>
              )}
            </Skeleton>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Skeleton width={'100%'} height={70} {...SkeletonCommonProps}>
            {item && (
              <Animated.Text
                {...AnimationCommonProps}
                numberOfLines={4}
                style={styles.cardDescription}>
                {description}
              </Animated.Text>
            )}
          </Skeleton>
        </View>
      </Skeleton.Group>
    </View>
  );
};

export default memo(UserCard);

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    flexDirection: 'row',
  },
  card: {
    borderWidth: 0.3,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countryTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});
