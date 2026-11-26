import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from './app.json';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { resolveLocale, type SupportedLocale } from './src/i18n/locales';

const LANGUAGE_KEY = '@kit-and-kick/language';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home' | 'playerQuiz' | 'settings'>('splash');
  const [locale, setLocale] = useState<SupportedLocale | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setScreen('home'), 5000);
    return () => clearTimeout(splashTimer);
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

  const activeLocale = locale ?? resolveLocale(undefined);

  if (screen === 'splash' || !settingsLoaded) {
    return (
      <View style={styles.splash}>
        <StatusBar hidden />
        <Image source={require('./assets/brand/splash.png')} style={styles.splashImage} resizeMode="contain" accessibilityLabel="Kit & Kick" />
        <Text style={styles.version}>VERSION {appConfig.expo.version}</Text>
      </View>
    );
  }

  if (screen === 'settings') {
    return <SettingsScreen locale={activeLocale} selectedLocale={locale} onChangeLocale={changeLocale} onBack={() => setScreen('home')} />;
  }
  if (screen === 'playerQuiz') {
    return <QuizScreen locale={activeLocale} onBack={() => setScreen('home')} />;
  }
  return <HomeScreen locale={activeLocale} onStartPlayerQuiz={() => setScreen('playerQuiz')} onOpenSettings={() => setScreen('settings')} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#0B1830', alignItems: 'center', justifyContent: 'center' },
  splashImage: { width: '100%', height: '100%' },
  version: { position: 'absolute', bottom: 72, color: '#8DA8C5', fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
});
