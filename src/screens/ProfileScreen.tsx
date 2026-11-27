import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { User } from 'firebase/auth';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import type { UserProfile } from '../services/userProfile';

type Props = {
  locale: SupportedLocale;
  authUser: User;
  userProfile: UserProfile | null;
  onBack: () => void;
  onSignOut: () => void;
};

export default function ProfileScreen({ locale, authUser, userProfile, onBack, onSignOut }: Props) {
  const italian = locale === 'it';
  const label = {
    back: italian ? 'INDIETRO' : 'BACK',
    title: italian ? 'IL MIO PROFILO' : 'MY PROFILE',
    guest: italian ? 'Account ospite' : 'Guest account',
    registered: italian ? 'Account registrato' : 'Registered account',
    progression: italian ? 'PROGRESSIONE' : 'PROGRESSION',
    xp: italian ? 'XP TOTALI' : 'TOTAL XP',
    level: italian ? 'LIVELLO' : 'LEVEL',
    points: italian ? 'PUNTI' : 'POINTS',
    statistics: italian ? 'STATISTICHE' : 'STATISTICS',
    matches: italian ? 'PARTITE GIOCATE' : 'MATCHES PLAYED',
    rank: italian ? 'POSIZIONE IN CLASSIFICA' : 'LEADERBOARD RANK',
    history: italian ? 'CRONOLOGIA PARTITE' : 'MATCH HISTORY',
    historySoon: italian ? 'La cronologia sarà disponibile qui nel prossimo passaggio.' : 'Your match history will be available here in the next step.',
    account: italian ? 'ACCOUNT' : 'ACCOUNT',
    signOut: italian ? 'ESCI DALL’ACCOUNT' : 'SIGN OUT',
    signOutHint: italian ? 'Uscendo da un account ospite, non potrai recuperare questa identità automaticamente.' : 'If you sign out from a guest account, you will not be able to restore this identity automatically.',
    player: italian ? 'Giocatore' : 'Player',
  };

  const nickname = userProfile?.nickname || authUser.displayName || label.player;
  const email = authUser.email;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  {label.back}</Text>
        </Pressable>

        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{label.title}</Text>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.accountType}>{authUser.isAnonymous ? label.guest : label.registered}</Text>
            {!!email && <Text style={styles.email}>{email}</Text>}
          </View>
        </View>

        <Text style={styles.section}>{label.progression}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.xp.toLocaleString() ?? '—'}</Text>
            <Text style={styles.statLabel}>{label.xp}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.level ?? '—'}</Text>
            <Text style={styles.statLabel}>{label.level}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>{label.points}</Text>
          </View>
        </View>

        <Text style={styles.section}>{label.statistics}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>{label.matches}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>{label.rank}</Text>
          </View>
        </View>

        <Text style={styles.section}>{label.history}</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{label.historySoon}</Text>
        </View>

        <Text style={styles.section}>{label.account}</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{authUser.isAnonymous ? label.guest : label.registered}</Text>
          {!!email && <Text style={styles.email}>{email}</Text>}
          {authUser.isAnonymous && <Text style={styles.hint}>{label.signOutHint}</Text>}
          <Pressable onPress={onSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>{label.signOut}</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>KNOW THE GAME. OWN THE GAME.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, padding: 22, paddingTop: (StatusBar.currentHeight ?? 0) + 12, paddingBottom: 36 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 24 },
  backText: { color: colors.iceBlue, fontSize: 14, fontWeight: '800' },
  eyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 6, marginBottom: 22 },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 26 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 25, fontWeight: '900' },
  identityCopy: { flex: 1 },
  nickname: { color: colors.white, fontSize: 18, fontWeight: '900' },
  accountType: { color: colors.iceBlue, fontSize: 11, fontWeight: '800', marginTop: 4 },
  email: { color: colors.muted, fontSize: 11, marginTop: 5 },
  section: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 10, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 24 },
  statCard: { flexGrow: 1, flexBasis: '30%', minHeight: 82, borderRadius: 13, padding: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#294968', justifyContent: 'center' },
  statValue: { color: colors.white, fontSize: 23, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.6, marginTop: 6 },
  infoCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 24 },
  infoText: { color: colors.white, fontSize: 12, lineHeight: 18 },
  hint: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 10 },
  signOutButton: { minHeight: 46, borderRadius: 11, borderWidth: 1, borderColor: '#A84D5B', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  signOutText: { color: '#FF9BA5', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
