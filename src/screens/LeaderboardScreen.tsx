import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { collection, getCountFromServer, limit, onSnapshot, orderBy, query, where, type DocumentData } from 'firebase/firestore';
import type { SupportedLocale } from '../i18n/locales';
import { getCountryName } from '../data/countries';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';

type Entry = { uid: string; nickname: string; countryCode: string | null; xp: number; level: number };
type Scope = 'global' | 'national';
type Props = { locale: SupportedLocale; uid: string; xp: number; countryCode: string | null; onBack: () => void };
function readEntry(id: string, data: DocumentData): Entry {
  return { uid: id, nickname: typeof data.nickname === 'string' ? data.nickname : 'Player', countryCode: typeof data.countryCode === 'string' ? data.countryCode : null, xp: typeof data.xp === 'number' ? data.xp : 0, level: typeof data.level === 'number' ? data.level : 1 };
}

export default function LeaderboardScreen({ locale, uid, xp, countryCode, onBack }: Props) {
  const it = locale === 'it';
  const [scope, setScope] = useState<Scope>('global');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ownRank, setOwnRank] = useState<number | null>(null);
  const countryName = countryCode ? getCountryName(countryCode, locale) : null;

  useEffect(() => {
    setLoading(true);
    setError(false);
    setEntries([]);
    const base = collection(db, 'leaderboard');
    const q = scope === 'national' && countryCode
      ? query(base, where('countryCode', '==', countryCode), orderBy('xp', 'desc'), limit(50))
      : query(base, orderBy('xp', 'desc'), limit(50));
    return onSnapshot(q, snapshot => {
      setEntries(snapshot.docs.map(item => readEntry(item.id, item.data())));
      setLoading(false);
      setError(false);
    }, reason => {
      console.warn('Unable to load leaderboard:', reason);
      setLoading(false);
      setError(true);
    });
  }, [scope, countryCode]);

  useEffect(() => {
    let active = true;
    if (scope === 'national' && !countryCode) {
      setOwnRank(null);
      return () => { active = false; };
    }
    const constraints = scope === 'national'
      ? [where('countryCode', '==', countryCode), where('xp', '>', xp)]
      : [where('xp', '>', xp)];
    void getCountFromServer(query(collection(db, 'leaderboard'), ...constraints))
      .then(result => { if (active) setOwnRank(result.data().count + 1); })
      .catch(reason => {
        console.warn('Unable to calculate leaderboard position:', reason);
        if (active) setOwnRank(null);
      });
    return () => { active = false; };
  }, [scope, uid, xp, countryCode]);

  const ownEntry = entries.find(entry => entry.uid === uid);
  const medal = (position: number) => position === 1 ? '🏆' : position === 2 ? '🥈' : position === 3 ? '🥉' : String(position).padStart(2, '0');
  const title = scope === 'global'
    ? (it ? 'CLASSIFICA GLOBALE' : 'GLOBAL LEADERBOARD')
    : (it ? 'CLASSIFICA NAZIONALE' : 'NATIONAL LEADERBOARD');
  const subtitle = scope === 'global'
    ? (it ? 'I migliori 50 giocatori · XP totali' : 'Top 50 players · lifetime XP')
    : countryName
      ? (it ? `I migliori 50 in ${countryName} · XP totali` : `Top 50 in ${countryName} · lifetime XP`)
      : (it ? 'Imposta la nazionalità nel profilo per partecipare' : 'Set your nationality in Profile to participate');

  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  {it ? 'INDIETRO' : 'BACK'}</Text></Pressable>
      <Text style={styles.eyebrow}>KIT & KICK</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.tabs}>
        <Pressable onPress={() => setScope('global')} style={[styles.tab, scope === 'global' && styles.activeTab]}>
          <Text style={[styles.tabText, scope === 'global' && styles.activeTabText]}>{it ? 'GLOBALE' : 'GLOBAL'}</Text>
        </Pressable>
        <Pressable onPress={() => setScope('national')} style={[styles.tab, scope === 'national' && styles.activeTab]}>
          <Text style={[styles.tabText, scope === 'national' && styles.activeTabText]}>{countryCode ?? (it ? 'NAZIONALE' : 'NATIONAL')}</Text>
        </Pressable>
      </View>

      <View style={styles.ownCard}>
        <Text style={styles.ownLabel}>{it ? 'LA TUA POSIZIONE' : 'YOUR RANK'}</Text>
        <Text style={styles.ownValue}>{scope === 'national' && !countryCode ? '—' : ownRank === null ? '…' : '#' + ownRank}</Text>
        <Text style={styles.meta}>{xp.toLocaleString()} XP{scope === 'national' && !countryCode ? (it ? ' · imposta la nazionalità nel Profilo' : ' · set your nationality in Profile') : ownRank !== null && ownRank > 50 ? (it ? ' · fuori dalla Top 50' : ' · outside the Top 50') : ''}</Text>
      </View>

      <View style={styles.headerRow}><Text style={styles.headerText}>{it ? 'POS.' : 'RANK'}</Text><Text style={[styles.headerText, styles.playerColumn]}>{it ? 'GIOCATORE' : 'PLAYER'}</Text><Text style={styles.headerText}>XP</Text></View>
      {loading ? <ActivityIndicator color={colors.gold} style={{ marginTop: 28 }} /> :
        error ? <Text style={styles.message}>{it ? 'Impossibile caricare la classifica. Riprova.' : 'Unable to load leaderboard. Please try again.'}</Text> :
        scope === 'national' && !countryCode ? <Text style={styles.message}>{it ? 'Aggiungi la nazionalità dal Profilo per entrare nella classifica nazionale.' : 'Add your nationality in Profile to join the national leaderboard.'}</Text> :
        entries.length === 0 ? <Text style={styles.message}>{it ? 'La classifica è ancora vuota. Completa una partita per iniziare!' : 'The leaderboard is empty. Complete a quiz to get started!'}</Text> :
        entries.map((entry, index) => <View key={entry.uid} style={[styles.row, entry.uid === uid && styles.ownRow]}>
          <Text style={styles.position}>{medal(index + 1)}</Text>
          <View style={styles.playerColumn}>
            <Text numberOfLines={1} style={styles.nickname}>{entry.nickname}{entry.uid === uid ? (it ? ' (Tu)' : ' (You)') : ''}</Text>
            <Text style={styles.meta}>{entry.countryCode ?? '—'}  ·  LVL {entry.level}</Text>
          </View>
          <Text style={styles.xp}>{entry.xp.toLocaleString()}</Text>
        </View>)}
      <Text style={styles.footer}>{it ? 'La classifica considera gli XP accumulati in tutte le modalità.' : 'XP earned across all quiz modes count toward this leaderboard.'}</Text>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, padding: 20, paddingTop: (StatusBar.currentHeight ?? 0) + 10, paddingBottom: 48 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 22 },
  backText: { color: colors.iceBlue, fontSize: 13, fontWeight: '800' },
  eyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.white, fontSize: 25, fontWeight: '900', marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 11, marginTop: 7, marginBottom: 16 },
  tabs: { flexDirection: 'row', backgroundColor: '#102746', borderRadius: 12, padding: 4, marginBottom: 14 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 9 },
  activeTab: { backgroundColor: colors.electricBlue },
  tabText: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  activeTabText: { color: colors.white },
  ownCard: { marginBottom: 16, padding: 15, backgroundColor: '#102746', borderWidth: 1, borderColor: colors.gold, borderRadius: 14, alignItems: 'center' },
  ownLabel: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  ownValue: { color: colors.white, fontSize: 27, fontWeight: '900', marginTop: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#294968' },
  headerText: { color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1, width: 44 },
  playerColumn: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 62, paddingHorizontal: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#203A57' },
  ownRow: { backgroundColor: '#173653', borderRadius: 10, borderBottomWidth: 0 },
  position: { color: colors.gold, width: 44, fontSize: 16, fontWeight: '900' },
  nickname: { color: colors.white, fontSize: 12, fontWeight: '900' },
  meta: { color: colors.muted, fontSize: 9, marginTop: 4 },
  xp: { color: colors.white, fontSize: 13, fontWeight: '900', minWidth: 62, textAlign: 'right' },
  message: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 28 },
  footer: { color: colors.muted, fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 22 },
});
