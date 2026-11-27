import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { collection, getCountFromServer, limit, onSnapshot, orderBy, query, where, type DocumentData } from 'firebase/firestore';
import type { SupportedLocale } from '../i18n/locales';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';

type Entry = { uid: string; nickname: string; countryCode: string | null; xp: number; points: number; level: number };
type Metric = 'xp' | 'points';
type Scope = 'global' | 'national';
type Props = { locale: SupportedLocale; uid: string; xp: number; points: number; countryCode: string | null; initialScope: Scope; initialMetric: Metric; onBack: () => void };
function readEntry(id: string, data: DocumentData): Entry {
  return { uid: id, nickname: typeof data.nickname === 'string' ? data.nickname : 'Player', countryCode: typeof data.countryCode === 'string' ? data.countryCode : null, xp: typeof data.xp === 'number' ? data.xp : 0, points: typeof data.points === 'number' ? data.points : 0, level: typeof data.level === 'number' ? data.level : 1 };
}

export default function LeaderboardScreen({ locale, uid, xp, points, countryCode, initialScope, onBack }: Props) {
  const copy = ({
    it:{back:'INDIETRO',globalTitle:'CLASSIFICA GLOBALE',nationalTitle:'CLASSIFICA NAZIONALE',globalSubtitle:'I migliori 50 giocatori · XP totali',nationalSubtitle:'I migliori 50 giocatori del tuo Paese · XP totali',noCountrySubtitle:'Imposta la nazionalità nel profilo per partecipare',globalTab:'GLOBALE',nationalTab:'NAZIONALE',yourRank:'LA TUA POSIZIONE',setCountry:'imposta la nazionalità nel Profilo',outside:'fuori dalla Top 50',rank:'POS.',player:'GIOCATORE',error:'Impossibile caricare la classifica. Riprova.',noCountry:'Aggiungi la nazionalità dal Profilo per entrare nella classifica nazionale.',empty:'La classifica è ancora vuota. Completa una partita per iniziare!',you:'Tu',footer:'I totali sono cumulativi in tutte le modalità e non si azzerano.' ,xpTab:'XP',pointsTab:'PUNTI',pointsTitle:'CLASSIFICA PUNTI',pointsSubtitle:'I migliori 50 giocatori · punti totali',pointsFooter:'La classifica somma i punti ottenuti in tutte le modalità.'},
    en:{back:'BACK',globalTitle:'GLOBAL LEADERBOARD',nationalTitle:'NATIONAL LEADERBOARD',globalSubtitle:'Top 50 players · lifetime XP',nationalSubtitle:'Top 50 players in your country · lifetime XP',noCountrySubtitle:'Set your nationality in Profile to participate',globalTab:'GLOBAL',nationalTab:'NATIONAL',yourRank:'YOUR RANK',setCountry:'set your nationality in Profile',outside:'outside the Top 50',rank:'RANK',player:'PLAYER',error:'Unable to load leaderboard. Please try again.',noCountry:'Add your nationality in Profile to join the national leaderboard.',empty:'The leaderboard is empty. Complete a quiz to get started!',you:'You',footer:'Totals accumulate across all modes and never reset.',xpTab:'XP',pointsTab:'POINTS',pointsTitle:'POINTS LEADERBOARD',pointsSubtitle:'Top 50 players · total points',pointsFooter:'This leaderboard sums points earned across all modes.'},
    es:{back:'VOLVER',globalTitle:'CLASIFICACIÓN GLOBAL',nationalTitle:'CLASIFICACIÓN NACIONAL',globalSubtitle:'Los 50 mejores jugadores · XP totales',nationalSubtitle:'Los 50 mejores jugadores de tu país · XP totales',noCountrySubtitle:'Indica tu nacionalidad en el perfil para participar',globalTab:'GLOBAL',nationalTab:'NACIONAL',yourRank:'TU POSICIÓN',setCountry:'indica tu nacionalidad en el perfil',outside:'fuera del Top 50',rank:'POS.',player:'JUGADOR',error:'No se pudo cargar la clasificación. Inténtalo de nuevo.',noCountry:'Añade tu nacionalidad en el perfil para entrar en la clasificación nacional.',empty:'La clasificación está vacía. ¡Completa un quiz para empezar!',you:'Tú',footer:'Los totales se acumulan en todos los modos y nunca se reinician.',xpTab:'XP',pointsTab:'PUNTOS',pointsTitle:'CLASIFICACIÓN DE PUNTOS',pointsSubtitle:'Los 50 mejores jugadores · puntos totales',pointsFooter:'Esta clasificación suma los puntos obtenidos en todos los modos.'},
    fr:{back:'RETOUR',globalTitle:'CLASSEMENT MONDIAL',nationalTitle:'CLASSEMENT NATIONAL',globalSubtitle:'Top 50 des joueurs · XP cumulés',nationalSubtitle:'Top 50 des joueurs de votre pays · XP cumulés',noCountrySubtitle:'Indiquez votre nationalité dans le profil pour participer',globalTab:'MONDIAL',nationalTab:'NATIONAL',yourRank:'VOTRE POSITION',setCountry:'indiquez votre nationalité dans le profil',outside:'hors du Top 50',rank:'RANG',player:'JOUEUR',error:'Impossible de charger le classement. Réessayez.',noCountry:'Ajoutez votre nationalité dans le profil pour rejoindre le classement national.',empty:'Le classement est vide. Terminez un quiz pour commencer !',you:'Vous',footer:'Les totaux se cumulent dans tous les modes et ne sont jamais réinitialisés.',xpTab:'XP',pointsTab:'POINTS',pointsTitle:'CLASSEMENT PAR POINTS',pointsSubtitle:'Top 50 des joueurs · total des points',pointsFooter:'Ce classement additionne les points gagnés dans tous les modes.'},
    de:{back:'ZURÜCK',globalTitle:'WELTRANGLISTE',nationalTitle:'NATIONALE RANGLISTE',globalSubtitle:'Die besten 50 Spieler · Gesamt-XP',nationalSubtitle:'Die besten 50 Spieler deines Landes · Gesamt-XP',noCountrySubtitle:'Lege deine Nationalität im Profil fest, um teilzunehmen',globalTab:'WELTWEIT',nationalTab:'NATIONAL',yourRank:'DEIN RANG',setCountry:'lege deine Nationalität im Profil fest',outside:'außerhalb der Top 50',rank:'RANG',player:'SPIELER',error:'Rangliste konnte nicht geladen werden. Bitte erneut versuchen.',noCountry:'Füge deine Nationalität im Profil hinzu, um an der nationalen Rangliste teilzunehmen.',empty:'Die Rangliste ist noch leer. Spiele ein Quiz, um zu starten!',you:'Du',footer:'Die Gesamtwerte werden in allen Modi gesammelt und nie zurückgesetzt.',xpTab:'XP',pointsTab:'PUNKTE',pointsTitle:'PUNKTE-RANGLISTE',pointsSubtitle:'Die besten 50 Spieler · Gesamtpunkte',pointsFooter:'Diese Rangliste summiert Punkte aus allen Spielmodi.'}
  } as const)[locale];
  const [scope, setScope] = useState<Scope>(initialScope);
  const [metric, setMetric] = useState<Metric>('xp');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ownRank, setOwnRank] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setEntries([]);
    const base = collection(db, 'leaderboard');
    const q = scope === 'national' && countryCode
      ? query(base, where('countryCode', '==', countryCode), orderBy(metric, 'desc'), limit(50))
      : query(base, orderBy(metric, 'desc'), limit(50));
    return onSnapshot(q, snapshot => {
      setEntries(snapshot.docs.map(item => readEntry(item.id, item.data())));
      setLoading(false);
      setError(false);
    }, reason => {
      console.warn('Unable to load leaderboard:', reason);
      setLoading(false);
      setError(true);
    });
  }, [scope, countryCode, metric]);

  useEffect(() => {
    let active = true;
    if (scope === 'national' && !countryCode) {
      setOwnRank(null);
      return () => { active = false; };
    }
    const score = metric === 'xp' ? xp : points;
    const constraints = scope === 'national'
      ? [where('countryCode', '==', countryCode), where(metric, '>', score)]
      : [where(metric, '>', score)];
    void getCountFromServer(query(collection(db, 'leaderboard'), ...constraints, orderBy(metric, 'desc')))
      .then(result => { if (active) setOwnRank(result.data().count + 1); })
      .catch(reason => {
        console.warn('Unable to calculate leaderboard position:', reason);
        if (active) setOwnRank(null);
      });
    return () => { active = false; };
  }, [scope, uid, xp, points, countryCode, metric]);

  const ownEntry = entries.find(entry => entry.uid === uid);
  const medal = (position: number) => position === 1 ? '🏆' : position === 2 ? '🥈' : position === 3 ? '🥉' : String(position).padStart(2, '0');
  const title = metric === 'xp' ? (scope === 'global' ? copy.globalTitle : copy.nationalTitle) : copy.pointsTitle;
  const baseSubtitle = metric === 'xp' ? (scope === 'global' ? copy.globalSubtitle : copy.nationalSubtitle) : copy.pointsSubtitle;
  const subtitle = scope === 'national' && !countryCode ? copy.noCountrySubtitle : baseSubtitle;
  const scoreLabel = metric === 'xp' ? 'XP' : copy.pointsTab;
  const ownScore = metric === 'xp' ? xp : points;

  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  {copy.back}</Text></Pressable>
      <Text style={styles.eyebrow}>KIT & KICK</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.tabs}>
        <Pressable onPress={() => setMetric('xp')} style={[styles.tab, metric === 'xp' && styles.activeTab]}><Text style={[styles.tabText, metric === 'xp' && styles.activeTabText]}>{copy.xpTab}</Text></Pressable>
        <Pressable onPress={() => setMetric('points')} style={[styles.tab, metric === 'points' && styles.activeTab]}><Text style={[styles.tabText, metric === 'points' && styles.activeTabText]}>{copy.pointsTab}</Text></Pressable>
      </View>
      <View style={styles.tabs}>
        <Pressable onPress={() => setScope('global')} style={[styles.tab, scope === 'global' && styles.activeTab]}>
          <Text style={[styles.tabText, scope === 'global' && styles.activeTabText]}>{copy.globalTab}</Text>
        </Pressable>
        <Pressable onPress={() => setScope('national')} style={[styles.tab, scope === 'national' && styles.activeTab]}>
          <Text style={[styles.tabText, scope === 'national' && styles.activeTabText]}>{copy.nationalTab}</Text>
        </Pressable>
      </View>

      <View style={styles.ownCard}>
        <Text style={styles.ownLabel}>{copy.yourRank}</Text>
        <Text style={styles.ownValue}>{scope === 'national' && !countryCode ? '—' : ownRank === null ? '…' : '#' + ownRank}</Text>
        <Text style={styles.meta}>{ownScore.toLocaleString()} {scoreLabel}{scope === 'national' && !countryCode ? (' · ' + copy.setCountry) : ownRank !== null && ownRank > 50 ? (' · ' + copy.outside) : ''}</Text>
      </View>

      <View style={styles.headerRow}><Text style={styles.headerText}>{copy.rank}</Text><Text style={[styles.headerText, styles.playerColumn]}>{copy.player}</Text><Text style={styles.headerText}>{scoreLabel}</Text></View>
      {loading ? <ActivityIndicator color={colors.gold} style={{ marginTop: 28 }} /> :
        error ? <Text style={styles.message}>{copy.error}</Text> :
        scope === 'national' && !countryCode ? <Text style={styles.message}>{copy.noCountry}</Text> :
        entries.length === 0 ? <Text style={styles.message}>{copy.empty}</Text> :
        entries.map((entry, index) => <View key={entry.uid} style={[styles.row, entry.uid === uid && styles.ownRow]}>
          <Text style={styles.position}>{medal(index + 1)}</Text>
          <View style={styles.playerColumn}>
            <Text numberOfLines={1} style={styles.nickname}>{entry.nickname}{entry.uid === uid ? (' (' + copy.you + ')') : ''}</Text>
            <Text style={styles.meta}>{entry.countryCode ?? '—'}  ·  LVL {entry.level}</Text>
          </View>
          <Text style={styles.xp}>{(metric === 'xp' ? entry.xp : entry.points).toLocaleString()}</Text>
        </View>)}
      <Text style={styles.footer}>{metric === 'xp' ? copy.footer : copy.pointsFooter}</Text>
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
