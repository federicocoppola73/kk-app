import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const modes = [
  { number: '01', title: 'PLAYER ID', detail: 'Name the player from the photo', tag: 'PHOTO QUIZ' },
  { number: '02', title: 'CLUB ID', detail: 'Recognise the club behind the player', tag: 'PHOTO QUIZ' },
  { number: '03', title: 'CAREER PATH', detail: 'Follow the clubs. Guess the player.', tag: 'PRO CHALLENGE' },
  { number: '04', title: 'BADGE QUIZ', detail: 'Identify the club from its crest', tag: 'CLUB KNOWLEDGE' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>KIT <Text style={styles.brandAccent}>&</Text> KICK</Text>
            <Text style={styles.kicker}>FOOTBALL QUIZ & GAMING</Text>
          </View>
          <View style={styles.profile}>
            <Text style={styles.profileText}>K&K</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.overline}>THE GAME STARTS NOW</Text>
          <Text style={styles.headline}>HOW WELL DO YOU{ '\n' }KNOW FOOTBALL?</Text>
          <Text style={styles.subhead}>Prove your knowledge. Climb the ranks. Own the game.</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>LVL 01</Text>
              <Text style={styles.statLabel}>ROOKIE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>0 XP</Text>
              <Text style={styles.statLabel}>TOTAL XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>GLOBAL RANK</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>CHOOSE YOUR CHALLENGE</Text>
          <Text style={styles.sectionMeta}>4 GAME MODES</Text>
        </View>

        <View style={styles.modeGrid}>
          {modes.map((mode) => (
            <View key={mode.number} style={styles.modeCard}>
              <View style={styles.modeTop}>
                <Text style={styles.modeNumber}>{mode.number}</Text>
                <Text style={styles.modeTag}>{mode.tag}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDetail}>{mode.detail}</Text>
              <View style={styles.modeFooter}>
                <Text style={styles.playLabel}>PLAY MODE</Text>
                <Text style={styles.arrow}>↗</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.dailyCard}>
          <View style={styles.dailyBadge}><Text style={styles.dailyBadgeText}>DAILY</Text></View>
          <View style={styles.dailyCopy}>
            <Text style={styles.dailyTitle}>DAILY CHALLENGE</Text>
            <Text style={styles.dailyText}>One new challenge. Every day. Can you keep your streak?</Text>
          </View>
          <Text style={styles.dailyArrow}>→</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>KNOW THE GAME. OWN THE GAME.</Text>
          <Text style={styles.version}>KIT & KICK  •  PREVIEW 0.1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 36 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brand: { color: colors.white, fontSize: 22, fontWeight: '900', letterSpacing: 1.5 },
  brandAccent: { color: colors.iceBlue },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginTop: 3 },
  profile: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: colors.electricBlue, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.iceBlue, fontSize: 13, fontWeight: '900' },
  hero: { backgroundColor: '#102746', borderRadius: 22, borderWidth: 1, borderColor: '#1D4268', padding: 20, marginBottom: 28 },
  overline: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headline: { color: colors.white, fontSize: 28, lineHeight: 32, fontWeight: '900', letterSpacing: -0.7, marginTop: 12 },
  subhead: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#29435F' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.white, fontSize: 15, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 5 },
  statDivider: { width: 1, height: 28, backgroundColor: '#29435F' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  sectionTitle: { color: colors.white, fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  sectionMeta: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  modeCard: { width: '48.3%', minHeight: 160, backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: '#25415F', padding: 13 },
  modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeNumber: { color: colors.iceBlue, fontSize: 11, fontWeight: '900' },
  modeTag: { color: colors.muted, fontSize: 7, fontWeight: '800', letterSpacing: 0.6 },
  modeTitle: { color: colors.white, fontSize: 15, fontWeight: '900', marginTop: 19 },
  modeDetail: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 5, minHeight: 30 },
  modeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2B4562', marginTop: 12, paddingTop: 9 },
  playLabel: { color: colors.iceBlue, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  arrow: { color: colors.white, fontSize: 16, fontWeight: '800' },
  dailyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#182F4A', borderWidth: 1, borderColor: '#725B2B', borderRadius: 17, padding: 15, marginTop: 20 },
  dailyBadge: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#3B3425', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dailyBadgeText: { color: colors.gold, fontSize: 9, fontWeight: '900' },
  dailyCopy: { flex: 1 },
  dailyTitle: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  dailyText: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  dailyArrow: { color: colors.gold, fontSize: 22, fontWeight: '700', marginLeft: 8 },
  footer: { alignItems: 'center', marginTop: 28 },
  footerText: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  version: { color: '#7186A1', fontSize: 8, fontWeight: '700', letterSpacing: 1, marginTop: 7 },
});
