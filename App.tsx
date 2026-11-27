import React, { useEffect, useState } from 'react';
import { BackHandler, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from './app.json';
import { auth, db } from './src/services/firebase';
import { ensureUserProfile, normalizeNickname, type UserProfile } from './src/services/userProfile';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import QuizScreen from './src/screens/QuizScreen';
import ClubQuizScreen from './src/screens/ClubQuizScreen';
import StadiumQuizScreen from './src/screens/StadiumQuizScreen';
import CareerQuizScreen from './src/screens/CareerQuizScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MatchHistoryScreen from './src/screens/MatchHistoryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import { resolveLocale, type SupportedLocale } from './src/i18n/locales';

const LANGUAGE_KEY = '@kit-and-kick/language';

type Screen = 'splash' | 'gate' | 'home' | 'playerQuiz' | 'clubQuiz' | 'stadiumQuiz' | 'careerQuiz' | 'settings' | 'profile' | 'matchHistory' | 'statistics';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [locale, setLocale] = useState<SupportedLocale | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
        if (user && current === 'gate') return 'home';
        if (!user && current === 'home') return 'gate';
        return current;
      });
    }, () => {
      setAuthReady(true);
      setAuthUser(null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'home') {
        return false;
      }

      // Quiz screens own their exit confirmation and handle this event first.
      if (screen === 'playerQuiz' || screen === 'clubQuiz' || screen === 'stadiumQuiz' || screen === 'careerQuiz') {
        return false;
      }

      if (screen === 'matchHistory' || screen === 'statistics') {
        setScreen('profile');
        return true;
      }

      if (screen === 'settings' || screen === 'profile') {
        setScreen('home');
        return true;
      }

      // Keep the system back button from closing the app on splash/auth screens.
      return true;
    });

    return () => subscription.remove();
  }, [screen]);

  useEffect(() => {
    if (!authUser) {
      setUserProfile(null);
      return;
    }

    // Anonymous sign-in briefly exposes a user before continueAsGuest assigns
    // its generated display name and creates the corresponding Firestore profile.
    if (authUser.isAnonymous && !authUser.displayName) return;

    const profileRef = doc(db, 'users', authUser.uid);
    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      if (!snapshot.exists()) {
        setUserProfile(null);
        return;
      }
      const data = snapshot.data();
      setUserProfile({
        nickname: typeof data.nickname === 'string' ? data.nickname : (authUser.displayName ?? 'Player'),
        nicknameKey: typeof data.nicknameKey === 'string' ? data.nicknameKey : normalizeNickname(typeof data.nickname === 'string' ? data.nickname : (authUser.displayName ?? 'Player')),
        countryCode: typeof data.countryCode === 'string' ? data.countryCode : null,
        xp: typeof data.xp === 'number' ? data.xp : 0,
        level: typeof data.level === 'number' ? data.level : 1,
      });
    }, (error) => {
      console.warn('Unable to load user profile from Firestore:', error);
      setUserProfile(null);
    });

    void ensureUserProfile(authUser).catch((error) => {
      console.warn('Unable to initialize user profile in Firestore:', error);
    });

    return unsubscribe;
  }, [authUser]);

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

  if (screen === 'matchHistory') {
    return <MatchHistoryScreen locale={activeLocale} authUser={authUser} onBack={() => setScreen('profile')} />;
  }
  if (screen === 'profile') {
    return <ProfileScreen locale={activeLocale} authUser={authUser} userProfile={userProfile} onBack={() => setScreen('home')} onViewAllHistory={() => setScreen('matchHistory')} onViewStatistics={() => setScreen('statistics')} onSignOut={() => { void signOut(auth).catch((error) => console.warn('Unable to sign out:', error)); }} />;
  }
  if (screen === 'statistics') {
    return <StatisticsScreen locale={activeLocale} authUser={authUser} onBack={() => setScreen('profile')} />;
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
  return <HomeScreen locale={activeLocale} xp={userProfile?.xp ?? null} level={userProfile?.level ?? null} onStartPlayerQuiz={() => setScreen('playerQuiz')} onStartClubQuiz={() => setScreen('clubQuiz')} onStartStadiumQuiz={() => setScreen('stadiumQuiz')} onStartCareerQuiz={() => setScreen('careerQuiz')} onOpenSettings={() => setScreen('settings')} onOpenProfile={() => setScreen('profile')} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#0B1830', alignItems: 'center', justifyContent: 'center' },
  splashImage: { width: '100%', height: '100%' },
  version: { position: 'absolute', bottom: 72, color: '#8DA8C5', fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
});
