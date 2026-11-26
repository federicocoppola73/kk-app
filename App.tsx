import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import appConfig from './app.json';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home' | 'playerQuiz'>('splash');

  useEffect(() => {
    const splashTimer = setTimeout(() => setScreen('home'), 5000);
    return () => clearTimeout(splashTimer);
  }, []);

  if (screen === 'splash') {
    return (
      <View style={styles.splash}>
        <StatusBar hidden />
        <Image
          source={require('./assets/brand/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
          accessibilityLabel="Kit & Kick"
        />
        <Text style={styles.version}>VERSION {appConfig.expo.version}</Text>
      </View>
    );
  }

  if (screen === 'playerQuiz') {
    return <QuizScreen onBack={() => setScreen('home')} />;
  }

  return <HomeScreen onStartPlayerQuiz={() => setScreen('playerQuiz')} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0B1830',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  version: {
    position: 'absolute',
    bottom: 72,
    color: '#8DA8C5',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
