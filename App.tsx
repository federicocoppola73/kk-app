import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'playerQuiz'>('home');

  if (screen === 'playerQuiz') {
    return <QuizScreen onBack={() => setScreen('home')} />;
  }

  return <HomeScreen onStartPlayerQuiz={() => setScreen('playerQuiz')} />;
}
