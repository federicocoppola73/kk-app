import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { db } from '../services/firebase';

type Props = { locale: SupportedLocale; authUser: User; onBack: () => void };
type ModeStats = { matches: number; correctAnswers: number; totalQuestions: number };

const MODES = [
  { id:'player', labels:{it:'GIOCATORE',en:'PLAYER',es:'JUGADOR',fr:'JOUEUR',de:'SPIELER'} },
  { id:'club', labels:{it:'CLUB',en:'CLUB',es:'CLUB',fr:'CLUB',de:'VEREIN'} },
  { id:'career', labels:{it:'CARRIERA',en:'CAREER PATH',es:'TRAYECTORIA',fr:'PARCOURS',de:'KARRIEREWEG'} },
  { id:'stadium', labels:{it:'STADIO',en:'STADIUM',es:'ESTADIO',fr:'STADE',de:'STADION'} },
] as const;

const EMPTY_STATS = (): ModeStats => ({ matches: 0, correctAnswers: 0, totalQuestions: 0 });

export default function StatisticsScreen({ locale, authUser, onBack }: Props) {
  const labels = ({
    it:{back:'INDIETRO',title:'DETTAGLIO STATISTICHE',subtitle:'Le tue prestazioni, modalità per modalità.',matches:'PARTITE',correct:'RISPOSTE CORRETTE',accuracy:'PRECISIONE',loading:'Caricamento statistiche…',error:'Impossibile caricare le statistiche. Riprova più tardi.',empty:'Completa una partita per iniziare a vedere le tue statistiche.',footer:'CONOSCI IL GIOCO. DOMINA IL GIOCO.'},
    en:{back:'BACK',title:'STATISTICS DETAILS',subtitle:'Your performance, broken down by game mode.',matches:'MATCHES',correct:'CORRECT ANSWERS',accuracy:'ACCURACY',loading:'Loading statistics…',error:'Unable to load statistics. Please try again later.',empty:'Complete a match to start seeing your statistics.',footer:'KNOW THE GAME. OWN THE GAME.'},
    es:{back:'VOLVER',title:'DETALLE DE ESTADÍSTICAS',subtitle:'Tu rendimiento desglosado por modo de juego.',matches:'PARTIDAS',correct:'RESPUESTAS CORRECTAS',accuracy:'PRECISIÓN',loading:'Cargando estadísticas…',error:'No se pudieron cargar las estadísticas. Inténtalo más tarde.',empty:'Completa una partida para empezar a ver tus estadísticas.',footer:'CONOCE EL JUEGO. DOMINA EL JUEGO.'},
    fr:{back:'RETOUR',title:'DÉTAIL DES STATISTIQUES',subtitle:'Vos performances, mode de jeu par mode de jeu.',matches:'MATCHS',correct:'BONNES RÉPONSES',accuracy:'PRÉCISION',loading:'Chargement des statistiques…',error:'Impossible de charger les statistiques. Réessayez plus tard.',empty:'Terminez un match pour commencer à consulter vos statistiques.',footer:'CONNAISSEZ LE JEU. DOMINEZ LE JEU.'},
    de:{back:'ZURÜCK',title:'STATISTIKEN IM DETAIL',subtitle:'Deine Leistung nach Spielmodus aufgeschlüsselt.',matches:'SPIELE',correct:'RICHTIGE ANTWORTEN',accuracy:'TREFFERQUOTE',loading:'Statistiken werden geladen…',error:'Statistiken konnten nicht geladen werden. Bitte später erneut versuchen.',empty:'Schließe ein Spiel ab, um deine Statistiken zu sehen.',footer:'KENNE DAS SPIEL. BEHERRSCHE DAS SPIEL.'}
  } as const)[locale];
  const [stats, setStats] = useState<Record<string, ModeStats>>({});
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
      const next: Record<string, ModeStats> = {};
      MODES.forEach((mode) => { next[mode.id] = EMPTY_STATS(); });

      snapshot.docs.forEach((item) => {
        const data = item.data();
        if (typeof data.mode !== 'string' || !next[data.mode]) return;
        const current = next[data.mode];
        current.matches += 1;
        current.correctAnswers += typeof data.correctAnswers === 'number' ? data.correctAnswers : 0;
        current.totalQuestions += typeof data.totalQuestions === 'number' ? data.totalQuestions : 10;
      });

      setStats(next);
      setLoading(false);
      setError(false);
    }, (snapshotError) => {
      console.warn('Unable to load statistics from Firestore:', snapshotError);
      setLoading(false);
      setError(true);
    });
  }, [authUser.uid]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  {labels.back}</Text>
        </Pressable>
        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>

        {loading ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loading}</Text></View>
        ) : error ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.error}</Text></View>
        ) : (
          <>
            {MODES.map((mode) => {
              const item = stats[mode.id] ?? EMPTY_STATS();
              const accuracy = item.totalQuestions > 0
                ? Math.round((item.correctAnswers / item.totalQuestions) * 100)
                : 0;
              return (
                <View key={mode.id} style={styles.modeCard}>
                  <Text style={styles.modeTitle}>{mode.labels[locale]}</Text>
                  <View style={styles.metrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{item.matches}</Text>
                      <Text style={styles.metricLabel}>{labels.matches}</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{item.correctAnswers.toLocaleString()}</Text>
                      <Text style={styles.metricLabel}>{labels.correct}</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{accuracy}%</Text>
                      <Text style={styles.metricLabel}>{labels.accuracy}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            {Object.values(stats).every((item) => item.matches === 0) && (
              <View style={styles.infoCard}><Text style={styles.infoText}>{labels.empty}</Text></View>
            )}
          </>
        )}

        <Text style={styles.footer}>{labels.footer}</Text>
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
  title: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8, marginBottom: 22 },
  modeCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 11 },
  modeTitle: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  metrics: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, minWidth: 0 },
  metricValue: { color: colors.white, fontSize: 22, fontWeight: '900' },
  metricLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.4, marginTop: 5 },
  infoCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  infoText: { color: colors.white, fontSize: 12, lineHeight: 18 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
