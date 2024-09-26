import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import {Canvas, Rect, Line, Paint, Image, useImage} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const GRID_SIZE = 20;
const CELL_SIZE = Math.floor(SCREEN_WIDTH / GRID_SIZE);
const GAME_AREA_SIZE = GRID_SIZE * CELL_SIZE;
const BOUNDARY_WIDTH = 2;
const BORDER_WIDTH = 4;

const SNAKE_BODY_SIZE = CELL_SIZE * 0.8;
const APPLE_SIZE = CELL_SIZE * 1.5;

const GAME_SPEED = 200; 

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = {x: number; y: number};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{x: 5, y: 5}]);
  const [food, setFood] = useState<Position>({x: 10, y: 10});
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const snakeX = useSharedValue(snake[0].x * CELL_SIZE);
  const snakeY = useSharedValue(snake[0].y * CELL_SIZE);

  const snakeBodyImage = useImage(require('../../assets/snake-body.png'));
  const foodImage = useImage(require('../../assets/apple.png'));

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      const gameLoop = setInterval(() => {
        moveSnake();
      }, GAME_SPEED);

      return () => clearInterval(gameLoop);
    }
  }, [isGameStarted, isGameOver, snake, direction]);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = {...newSnake[0]};

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood(newSnake));
      setScore(prevScore => prevScore + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    snakeX.value = withTiming(head.x * CELL_SIZE, {duration: 100, easing: Easing.linear});
    snakeY.value = withTiming(head.y * CELL_SIZE, {duration: 100, easing: Easing.linear});
  }, [snake, direction, food]);

  const generateFood = (snakeBody: Position[]): Position => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const updateDirection = useCallback((newDirection: Direction) => {
    setDirection(prevDirection => {
      // Prevent 180-degree turns
      if (
        (prevDirection === 'UP' && newDirection === 'DOWN') ||
        (prevDirection === 'DOWN' && newDirection === 'UP') ||
        (prevDirection === 'LEFT' && newDirection === 'RIGHT') ||
        (prevDirection === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prevDirection;
      }
      return newDirection;
    });
  }, []);

  const gesture = Gesture.Pan()
    .onStart((event) => {
      const {translationX, translationY} = event;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        runOnJS(updateDirection)(translationX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        runOnJS(updateDirection)(translationY > 0 ? 'DOWN' : 'UP');
      }
    })
    .minDistance(10);

  const startGame = () => {
    setIsGameStarted(true);
    setSnake([{x: 5, y: 5}]);
    setDirection('RIGHT');
    setFood(generateFood([{x: 5, y: 5}]));
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <GestureDetector gesture={gesture}>
        <View>
          <Canvas style={styles.canvas}>
            {/* White border */}
            <Rect
              x={0}
              y={0}
              width={GAME_AREA_SIZE}
              height={GAME_AREA_SIZE}
              color="transparent"
            >
              <Paint
                color="white"
                style="stroke"
                strokeWidth={BORDER_WIDTH}
              />
            </Rect>
            
            {/* Red danger zone */}
            <Rect
              x={BORDER_WIDTH / 2}
              y={BORDER_WIDTH / 2}
              width={GAME_AREA_SIZE - BORDER_WIDTH}
              height={GAME_AREA_SIZE - BORDER_WIDTH}
              color="transparent"
            >
              <Paint
                color="red"
                style="stroke"
                strokeWidth={BOUNDARY_WIDTH}
              />
            </Rect>
            
            {/* Grid lines (optional) */}
            {Array.from({length: GRID_SIZE + 1}).map((_, index) => (
              <React.Fragment key={`grid-${index}`}>
                <Line
                  p1={{x: 0, y: index * CELL_SIZE}}
                  p2={{x: GAME_AREA_SIZE, y: index * CELL_SIZE}}
                  color="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
                <Line
                  p1={{x: index * CELL_SIZE, y: 0}}
                  p2={{x: index * CELL_SIZE, y: GAME_AREA_SIZE}}
                  color="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {/* Snake */}
            {snake.map((segment, index) => {
              const x = index === 0 ? snakeX.value : segment.x * CELL_SIZE;
              const y = index === 0 ? snakeY.value : segment.y * CELL_SIZE;
              return (
                <Image
                  key={index}
                  image={snakeBodyImage}
                  x={x - (SNAKE_BODY_SIZE - CELL_SIZE) / 2}
                  y={y - (SNAKE_BODY_SIZE - CELL_SIZE) / 2}
                  width={SNAKE_BODY_SIZE}
                  height={SNAKE_BODY_SIZE}
                  fit="contain"
                />
              );
            })}

            {/* Food */}
            <Image
              image={foodImage}
              x={food.x * CELL_SIZE - (APPLE_SIZE - CELL_SIZE) / 2}
              y={food.y * CELL_SIZE - (APPLE_SIZE - CELL_SIZE) / 2}
              width={APPLE_SIZE}
              height={APPLE_SIZE}
              fit="contain"
            />
          </Canvas>
          {!isGameStarted && (
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          )}
          {isGameOver && (
            <View style={styles.gameOverOverlay}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <TouchableOpacity style={styles.restartButton} onPress={startGame}>
                <Text style={styles.restartButtonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  canvas: {
    width: GAME_AREA_SIZE,
    height: GAME_AREA_SIZE,
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'white',
    fontSize: 20,
  },
  startButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -50}, {translateY: -25}],
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SnakeGame;