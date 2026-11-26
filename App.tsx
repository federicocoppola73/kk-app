import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const colors = {
  background: '#0B1830',
  surface: '#142947',
  blue: '#168DE0',
  ice: '#55B8FF',
  white: '#FFFFFF',
  muted: '#A9BDD8',
};

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.logoMark}>
          <Text style={styles.logoInitials}>K&K</Text>
        </View>
        <Text style={styles.wordmark}>KIT & KICK</Text>
        <Text style={styles.tagline}>KNOW THE GAME. OWN THE GAME.</Text>
        <View style={styles.divider} />
        <Text style={styles.eyebrow}>FOOTBALL QUIZ & GAMING</Text>
        <Text style={styles.heading}>Your football knowledge starts here.</Text>
        <Text style={styles.description}>
          Identify players, recognise clubs and prove how well you know the game.
        </Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>PROJECT SCAFFOLD READY</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoMark: {
    width: 92,
    height: 104,
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  logoInitials: { color: colors.ice, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  wordmark: { color: colors.white, fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  tagline: { color: colors.ice, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 9 },
  divider: { width: 54, height: 3, borderRadius: 2, backgroundColor: colors.blue, marginVertical: 30 },
  eyebrow: { color: colors.ice, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  heading: { color: colors.white, fontSize: 26, lineHeight: 32, fontWeight: '800', textAlign: 'center' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 12, maxWidth: 310 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 34,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.ice },
  statusText: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
