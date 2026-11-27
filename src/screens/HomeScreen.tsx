import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';

export default function HomeScreen({ locale, xp, level, onStartPlayerQuiz, onStartClubQuiz, onStartStadiumQuiz, onStartCareerQuiz, onOpenSettings, onOpenProfile }: { locale: SupportedLocale; xp: number | null; level: number | null; onStartPlayerQuiz: () => void; onStartClubQuiz: () => void; onStartStadiumQuiz: () => void; onStartCareerQuiz: () => void; onOpenSettings: () => void; onOpenProfile: () => void }) {
  const t = translations[locale];

  const modes = [
    { number: '01', title: t.playerTitle, detail: t.playerDetail, tag: t.photoQuiz },
    { number: '02', title: t.clubTitle, detail: t.clubDetail, tag: t.clubKnowledge },
    { number: '03', title: t.careerTitle, detail: t.careerDetail, tag: t.proChallenge },
    { number: '04', title: t.stadiumTitle, detail: t.stadiumDetail, tag: t.stadiumKnowledge },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>KIT <Text style={styles.brandAccent}>&</Text> KICK</Text>
            <Text style={styles.kicker}>{t.kicker}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable onPress={onOpenProfile} accessibilityRole="button" accessibilityLabel={locale === 'it' ? 'Profilo' : 'Profile'} style={styles.profile}>
              <View style={styles.personIcon}>
                <View style={styles.personHead} />
                <View style={styles.personBody} />
              </View>
            </Pressable>
            <Pressable onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel={t.settingsTitle} style={styles.settings}>
              <Text style={styles.settingsGlyph}>⚙</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.overline}>{t.overline}</Text>
          <Text style={styles.headline}>{t.headline}</Text>
          <Text style={styles.subhead}>{t.subhead}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>LVL {level === null ? '--' : String(level).padStart(2, '0')}</Text>
              <Text style={styles.statLabel}>{t.rookie}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{xp === null ? '—' : xp.toLocaleString()} XP</Text>
              <Text style={styles.statLabel}>{t.totalXp}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>{t.globalRank}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{t.chooseChallenge}</Text>
          <Text style={styles.sectionMeta}>{t.gameModes}</Text>
        </View>

        <View style={styles.modeGrid}>
          {modes.map((mode) => (
            <Pressable key={mode.number} onPress={mode.number === '01' ? onStartPlayerQuiz : mode.number === '02' ? onStartClubQuiz : mode.number === '03' ? onStartCareerQuiz : onStartStadiumQuiz} style={({ pressed }) => [styles.modeCard, pressed && styles.modeCardPressed]}>
              <View style={styles.modeTop}>
                <Text style={styles.modeNumber}>{mode.number}</Text>
                <Text style={styles.modeTag}>{mode.tag}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDetail}>{mode.detail}</Text>
              <View style={styles.modeFooter}>
                <Text style={styles.playLabel}>{t.playMode}</Text>
                <Text style={styles.arrow}>↗</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.dailyCard}>
          <View style={styles.dailyBadge}><Text style={styles.dailyBadgeText}>{t.daily}</Text></View>
          <View style={styles.dailyCopy}>
            <Text style={styles.dailyTitle}>{t.dailyChallenge}</Text>
            <Text style={styles.dailyText}>{t.dailyText}</Text>
          </View>
          <Text style={styles.dailyArrow}>→</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.slogan}</Text>
          <Text style={styles.version}>{t.preview}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  content: { paddingHorizontal: 16, paddingTop: (StatusBar.currentHeight ?? 0) + 8, paddingBottom: 28 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brand: { color: colors.white, fontSize: 22, fontWeight: '900', letterSpacing: 1.5 },
  brandAccent: { color: colors.iceBlue },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginTop: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profile: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: colors.electricBlue, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  personIcon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'flex-end' },
  personHead: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.iceBlue, marginBottom: 2 },
  personBody: { width: 17, height: 10, borderTopLeftRadius: 9, borderTopRightRadius: 9, backgroundColor: colors.iceBlue },
  settings: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  settingsGlyph: { color: colors.white, fontSize: 22 },
  hero: { backgroundColor: '#102746', borderRadius: 22, borderWidth: 1, borderColor: '#1D4268', padding: 14, marginBottom: 13 },
  overline: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headline: { color: colors.white, fontSize: 24, lineHeight: 27, fontWeight: '900', letterSpacing: -0.7, marginTop: 8 },
  subhead: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 7 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 9, borderTopWidth: 1, borderTopColor: '#29435F' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.white, fontSize: 15, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 5 },
  statDivider: { width: 1, height: 28, backgroundColor: '#29435F' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: colors.white, fontSize: 13, fontWeight: '900', letterSpacing: 0.7 },
  sectionMeta: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 7 },
  modeCard: { width: '48.3%', minHeight: 122, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: '#25415F', padding: 10 },
  modeCardPressed: { opacity: 0.78, borderColor: colors.iceBlue },
  modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeNumber: { color: colors.iceBlue, fontSize: 11, fontWeight: '900' },
  modeTag: { color: colors.muted, fontSize: 7, fontWeight: '800', letterSpacing: 0.6 },
  modeTitle: { color: colors.white, fontSize: 13, fontWeight: '900', marginTop: 9 },
  modeDetail: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 4, minHeight: 26 },
  modeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2B4562', marginTop: 8, paddingTop: 7 },
  playLabel: { color: colors.iceBlue, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  arrow: { color: colors.white, fontSize: 16, fontWeight: '800' },
  dailyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#182F4A', borderWidth: 1, borderColor: '#725B2B', borderRadius: 15, padding: 10, marginTop: 10 },
  dailyBadge: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#3B3425', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dailyBadgeText: { color: colors.gold, fontSize: 9, fontWeight: '900' },
  dailyCopy: { flex: 1 },
  dailyTitle: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  dailyText: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  dailyArrow: { color: colors.gold, fontSize: 22, fontWeight: '700', marginLeft: 8 },
  footer: { alignItems: 'center', marginTop: 10 },
  footerText: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  version: { color: '#7186A1', fontSize: 8, fontWeight: '700', letterSpacing: 1, marginTop: 7 },
});
