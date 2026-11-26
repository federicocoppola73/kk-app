import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from './app.json';
import { auth } from './src/services/firebase';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import QuizScreen from './src/screens/QuizScreen';
import ClubQuizScreen from './src/screens/ClubQuizScreen';
import StadiumQuizScreen from './src/screens/StadiumQuizScreen';
import CareerQuizScreen from './src/screens/CareerQuizScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { resolveLocale, type SupportedLocale } from './src/i18n/locales';

const LANGUAGE_KEY = '@kit-and-kick/language';

type Screen = 'splash' | 'gate' | 'home' | 'playerQuiz' | 'clubQuiz' | 'stadiumQuiz' | 'careerQuiz' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [locale, setLocale] = useState<SupportedLocale | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setScreen('gate'), 5000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
      setScreen((current) => {
        if (current === 'splash') return current;
        return user ? 'home' : current === 'home' ? 'gate' : current;
      });
    }, () => {
      setAuthReady(true);
      setAuthUser(null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((saved) => {
        if (saved === 'auto' || saved === null) setLocale(null);
        else setLocale(resolveLocale(saved));
      })
      .catch(() => setLocale(null))
      .finally(() => setSettingsLoaded(true));
  }, []);

  const changeLocale = async (nextLocale: SupportedLocale | null) => {
    setLocale(nextLocale);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, nextLocale ?? 'auto');
    } catch {
      // The selected language remains active for this session if storage is unavailable.
    }
  };

  const activeLocale = locale ?? resolveLocale(getLocales()[0]?.languageCode);

  if (screen === 'splash' || !settingsLoaded || !authReady) {
    return (
      <View style={styles.splash}>
        <StatusBar hidden />
        <Image source={require('./assets/brand/splash.png')} style={styles.splashImage} resizeMode="contain" accessibilityLabel="Kit & Kick" />
        <Text style={styles.version}>VERSION {appConfig.expo.version}</Text>
      </View>
    );
  }

  if (!authUser) {
    return <AuthScreen locale={activeLocale} onAuthenticated={() => setScreen('home')} />;
  }

  if (screen === 'settings') {
    return <SettingsScreen locale={activeLocale} selectedLocale={locale} onChangeLocale={changeLocale} onBack={() => setScreen('home')} />;
  }
  if (screen === 'playerQuiz') {
    return <QuizScreen locale={activeLocale} onBack={() => setScreen('home')} />;
  }
  if (screen === 'clubQuiz') {
    return <ClubQuizScreen locale={activeLocale} onBack={() => setScreen('home')} />;
  }
  if (screen === 'stadiumQuiz') {
    return <StadiumQuizScreen locale={activeLocale} onBack={() => setScreen('home')} />;
  }
  if (screen === 'careerQuiz') {
    return <CareerQuizScreen locale={activeLocale} onBack={() => setScreen('home')} />;
  }
  return <HomeScreen locale={activeLocale} onStartPlayerQuiz={() => setScreen('playerQuiz')} onStartClubQuiz={() => setScreen('clubQuiz')} onStartStadiumQuiz={() => setScreen('stadiumQuiz')} onStartCareerQuiz={() => setScreen('careerQuiz')} onOpenSettings={() => setScreen('settings')} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#0B1830', alignItems: 'center', justifyContent: 'center' },
  splashImage: { width: '100%', height: '100%' },
  version: { position: 'absolute', bottom: 72, color: '#8DA8C5', fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
});
