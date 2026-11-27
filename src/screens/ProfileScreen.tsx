import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { db } from '../services/firebase';
import type { UserProfile } from '../services/userProfile';

type Props = {
  locale: SupportedLocale;
  authUser: User;
  userProfile: UserProfile | null;
  onBack: () => void;
  onSignOut: () => void;
  onViewAllHistory: () => void;
};

type MatchResult = {
  id: string;
  mode: string;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date | null;
  verification: string;
};

const MODE_LABELS: Record<string, { it: string; en: string }> = {
  player: { it: 'Player Quiz', en: 'Player Quiz' },
  club: { it: 'Club Quiz', en: 'Club Quiz' },
  career: { it: 'Career Path', en: 'Career Path' },
  stadium: { it: 'Stadium Quiz', en: 'Stadium Quiz' },
};

export default function ProfileScreen({ locale, authUser, userProfile, onBack, onSignOut, onViewAllHistory }: Props) {
  const italian = locale === 'it';
  const [results, setResults] = useState<MatchResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

  useEffect(() => {
    setHistoryLoading(true);
    setHistoryError(false);

    const resultsQuery = query(
      collection(db, 'users', authUser.uid, 'results'),
      orderBy('completedAt', 'desc'),
    );

    const unsubscribe = onSnapshot(resultsQuery, (snapshot) => {
      const nextResults = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          mode: typeof data.mode === 'string' ? data.mode : 'unknown',
          points: typeof data.points === 'number' ? data.points : 0,
          correctAnswers: typeof data.correctAnswers === 'number' ? data.correctAnswers : 0,
          totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : 10,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : null,
          verification: typeof data.verification === 'string' ? data.verification : 'unverified',
        };
      });
      setResults(nextResults);
      setHistoryLoading(false);
      setHistoryError(false);
    }, (error) => {
      console.warn('Unable to load quiz history from Firestore:', error);
      setHistoryLoading(false);
      setHistoryError(true);
    });

    return unsubscribe;
  }, [authUser.uid]);

  const labels = {
    back: italian ? 'INDIETRO' : 'BACK',
    title: italian ? 'IL MIO PROFILO' : 'MY PROFILE',
    guest: italian ? 'Account ospite' : 'Guest account',
    registered: italian ? 'Account registrato' : 'Registered account',
    progression: italian ? 'PROGRESSIONE' : 'PROGRESSION',
    xp: italian ? 'XP TOTALI' : 'TOTAL XP',
    level: italian ? 'LIVELLO' : 'LEVEL',
    points: italian ? 'PUNTI TOTALI' : 'TOTAL POINTS',
    statistics: italian ? 'STATISTICHE' : 'STATISTICS',
    matches: italian ? 'PARTITE GIOCATE' : 'MATCHES PLAYED',
    rank: italian ? 'POSIZIONE IN CLASSIFICA' : 'LEADERBOARD RANK',
    history: italian ? 'CRONOLOGIA PARTITE - ULTIME 5' : 'MATCH HISTORY - LAST 5',
    viewAll: italian ? 'VEDI TUTTE' : 'VIEW ALL',
    loading: italian ? 'Caricamento cronologia…' : 'Loading match history…',
    loadError: italian ? 'Impossibile caricare la cronologia. Riprova più tardi.' : 'Unable to load match history. Please try again later.',
    empty: italian ? 'Non hai ancora completato partite. Gioca una modalità per vedere qui i tuoi risultati.' : 'You have not completed any matches yet. Play a mode to see your results here.',
    unverified: italian ? 'NON VERIFICATO' : 'UNVERIFIED',
    correct: italian ? 'corrette' : 'correct',
    account: italian ? 'ACCOUNT' : 'ACCOUNT',
    signOut: italian ? 'ESCI DALL’ACCOUNT' : 'SIGN OUT',
    signOutHint: italian ? 'Uscendo da un account ospite, non potrai recuperare questa identità automaticamente.' : 'If you sign out from a guest account, you will not be able to restore this identity automatically.',
    player: italian ? 'Giocatore' : 'Player',
  };

  const nickname = userProfile?.nickname || authUser.displayName || labels.player;
  const email = authUser.email;
  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const modeName = (mode: string) => MODE_LABELS[mode]?.[italian ? 'it' : 'en'] ?? mode;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  {labels.back}</Text>
        </Pressable>

        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{labels.title}</Text>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.accountType}>{authUser.isAnonymous ? labels.guest : labels.registered}</Text>
            {!!email && <Text style={styles.email}>{email}</Text>}
          </View>
        </View>

        <Text style={styles.section}>{labels.progression}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.xp.toLocaleString() ?? '—'}</Text>
            <Text style={styles.statLabel}>{labels.xp}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.level ?? '—'}</Text>
            <Text style={styles.statLabel}>{labels.level}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{labels.points}</Text>
          </View>
        </View>

        <Text style={styles.section}>{labels.statistics}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{results.length}</Text>
            <Text style={styles.statLabel}>{labels.matches}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>{labels.rank}</Text>
          </View>
        </View>

        <Text style={styles.section}>{labels.history}</Text>
        {historyLoading ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loading}</Text></View>
        ) : historyError ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loadError}</Text></View>
        ) : results.length === 0 ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.empty}</Text></View>
        ) : (
          results.slice(0, 5).map((result) => (
            <View key={result.id} style={styles.matchCard}>
              <View style={styles.matchTop}>
                <Text style={styles.matchMode}>{modeName(result.mode)}</Text>
                <Text style={styles.matchPoints}>{result.points} {italian ? 'pt' : 'pts'}</Text>
              </View>
              <Text style={styles.matchMeta}>
                {result.correctAnswers}/{result.totalQuestions} {labels.correct}
                {result.completedAt ? `  ·  ${result.completedAt.toLocaleDateString(italian ? 'it-IT' : 'en-GB')}` : ''}
              </Text>
              <Text style={styles.verification}>{labels.unverified}</Text>
            </View>
          ))
        )}
        {!historyLoading && !historyError && results.length > 5 && (
          <Pressable onPress={onViewAllHistory} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{labels.viewAll}  ›</Text>
          </Pressable>
        )}

        <Text style={styles.section}>{labels.account}</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{authUser.isAnonymous ? labels.guest : labels.registered}</Text>
          {!!email && <Text style={styles.email}>{email}</Text>}
          {authUser.isAnonymous && <Text style={styles.hint}>{labels.signOutHint}</Text>}
          <Pressable onPress={onSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>{labels.signOut}</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>KNOW THE GAME. OWN THE GAME.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, padding: 22, paddingTop: (StatusBar.currentHeight ?? 0) + 12, paddingBottom: 56 },
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
  infoCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 12 },
  viewAllButton: { alignSelf: 'flex-end', paddingVertical: 10, paddingHorizontal: 4, marginBottom: 22 },
  viewAllText: { color: colors.iceBlue, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  matchCard: { padding: 14, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 9 },
  matchTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  matchMode: { color: colors.white, fontSize: 13, fontWeight: '900' },
  matchPoints: { color: colors.gold, fontSize: 14, fontWeight: '900' },
  matchMeta: { color: colors.muted, fontSize: 11, marginTop: 7 },
  verification: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginTop: 8 },
  infoText: { color: colors.white, fontSize: 12, lineHeight: 18 },
  hint: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 10 },
  signOutButton: { minHeight: 46, borderRadius: 11, borderWidth: 1, borderColor: '#A84D5B', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  signOutText: { color: '#FF9BA5', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
