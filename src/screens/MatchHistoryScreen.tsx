import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { db } from '../services/firebase';

type Props = { locale: SupportedLocale; authUser: User; onBack: () => void };
type MatchResult = {
  id: string; mode: string; points: number; correctAnswers: number;
  totalQuestions: number; completedAt: Date | null;
};

const MODES: Record<string, { it: string; en: string }> = {
  player: { it: 'Player Quiz', en: 'Player Quiz' },
  club: { it: 'Club Quiz', en: 'Club Quiz' },
  career: { it: 'Career Path', en: 'Career Path' },
  stadium: { it: 'Stadium Quiz', en: 'Stadium Quiz' },
};

export default function MatchHistoryScreen({ locale, authUser, onBack }: Props) {
  const italian = locale === 'it';
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const resultsQuery = query(
      collection(db, 'users', authUser.uid, 'results'),
      orderBy('completedAt', 'desc'),
    );
    return onSnapshot(resultsQuery, (snapshot) => {
      setResults(snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          mode: typeof data.mode === 'string' ? data.mode : 'unknown',
          points: typeof data.points === 'number' ? data.points : 0,
          correctAnswers: typeof data.correctAnswers === 'number' ? data.correctAnswers : 0,
          totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : 10,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : null,
        };
      }));
      setLoading(false);
      setError(false);
    }, (snapshotError) => {
      console.warn('Unable to load full match history from Firestore:', snapshotError);
      setLoading(false);
      setError(true);
    });
  }, [authUser.uid]);

  const labels = {
    back: italian ? 'INDIETRO' : 'BACK',
    title: italian ? 'CRONOLOGIA PARTITE' : 'MATCH HISTORY',
    loading: italian ? 'Caricamento cronologia…' : 'Loading match history…',
    error: italian ? 'Impossibile caricare la cronologia. Riprova più tardi.' : 'Unable to load match history. Please try again later.',
    empty: italian ? 'Non hai ancora completato partite.' : 'You have not completed any matches yet.',
    correct: italian ? 'corrette' : 'correct',
    unverified: italian ? 'NON VERIFICATO' : 'UNVERIFIED',
  };
  const modeName = (mode: string) => MODES[mode]?.[italian ? 'it' : 'en'] ?? mode;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  {labels.back}</Text>
        </Pressable>
        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{labels.title}</Text>
        {loading ? <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loading}</Text></View>
          : error ? <View style={styles.infoCard}><Text style={styles.infoText}>{labels.error}</Text></View>
          : results.length === 0 ? <View style={styles.infoCard}><Text style={styles.infoText}>{labels.empty}</Text></View>
          : results.map((result) => (
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
          ))}
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
  title: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 6, marginBottom: 22 },
  infoCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  infoText: { color: colors.white, fontSize: 12, lineHeight: 18 },
  matchCard: { padding: 14, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 9 },
  matchTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  matchMode: { color: colors.white, fontSize: 13, fontWeight: '900' },
  matchPoints: { color: colors.gold, fontSize: 14, fontWeight: '900' },
  matchMeta: { color: colors.muted, fontSize: 11, marginTop: 7 },
  verification: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginTop: 8 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
