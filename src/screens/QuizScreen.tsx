import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';
import { playerIdPlayers, type PlayerIdPlayer } from '../data/playerIdClues';

const ROUND_LENGTH = 10;
const XP_PER_CORRECT_ANSWER = 25;
const REVEAL_INTERVAL_MS = 4000;
const POINTS_BY_CLUE = [200, 160, 120, 80, 40];

type QuizQuestion = { player: PlayerIdPlayer; options: PlayerIdPlayer[] };
type Props = { locale: SupportedLocale; onBack: () => void };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildOptions(player: PlayerIdPlayer): PlayerIdPlayer[] {
  const pool = playerIdPlayers.filter((candidate) => candidate.id !== player.id);
  const selected: PlayerIdPlayer[] = [];
  const addFrom = (candidates: PlayerIdPlayer[]) => {
    for (const candidate of shuffle(candidates)) {
      if (selected.length === 3) break;
      if (!selected.some((item) => item.id === candidate.id)) selected.push(candidate);
    }
  };
  // Prefer players sharing nationality, then playing role, then fill from the full roster.
  addFrom(pool.filter((candidate) => candidate.nationality === player.nationality));
  addFrom(pool.filter((candidate) => candidate.position === player.position));
  addFrom(pool);
  return shuffle([player, ...selected]);
}

function createRound(): QuizQuestion[] {
  return shuffle(playerIdPlayers).slice(0, ROUND_LENGTH).map((player) => ({
    player,
    options: buildOptions(player),
  }));
}

const clueLabelKeys = {
  nationality: 'playerClueNationality',
  birthplace: 'playerClueBirthplace',
  role: 'playerClueRole',
  era: 'playerClueEra',
  fact: 'playerClueFact',
} as const;

type Clue = { key: keyof typeof clueLabelKeys; icon: string; label: string; value: string };

function getClues(player: PlayerIdPlayer, t: typeof translations.en, locale: SupportedLocale): Clue[] {
  const icons: Record<keyof typeof clueLabelKeys, string> = {
    nationality: '🌍', birthplace: '📍', role: '⚽', era: '⏳', fact: '🏆',
  };
  return player.clues.map((clue) => ({
    key: clue.key,
    icon: icons[clue.key],
    label: t[clueLabelKeys[clue.key]],
    value: locale === 'it' ? clue.it : clue.en,
  }));
}

export default function QuizScreen({ locale, onBack }: Props) {
  const t = translations[locale];
  const [questions, setQuestions] = useState<QuizQuestion[]>(createRound);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [revealStage, setRevealStage] = useState(0);

  const question = questions[questionIndex];
  const isCorrect = selectedAnswer === question.player.id;
  const progress = ((questionIndex + 1) / ROUND_LENGTH) * 100;
  const pointsAvailable = POINTS_BY_CLUE[revealStage];
  const clues = getClues(question.player, t, locale);
  const visibleClues = clues.slice(0, revealStage + 1);

  useEffect(() => {
    if (selectedAnswer !== null || showResult || revealStage >= POINTS_BY_CLUE.length - 1) return;
    const timeout = setTimeout(() => setRevealStage((stage) => Math.min(stage + 1, 4)), REVEAL_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [questionIndex, selectedAnswer, showResult, revealStage]);

  const restart = () => {
    setQuestions(createRound());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTotalPoints(0);
    setTotalXp(0);
    setShowResult(false);
    setRevealStage(0);
  };

  const continueRound = () => {
    if (selectedAnswer === null) return;
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setTotalPoints((value) => value + pointsAvailable);
      setTotalXp((value) => value + XP_PER_CORRECT_ANSWER);
    }
    if (questionIndex === ROUND_LENGTH - 1) {
      setShowResult(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setRevealStage(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>{t.backHome}</Text>
          </Pressable>
          <Text style={styles.roundLabel}>{t.playerIdRound}</Text>
        </View>

        {!showResult ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{String(questionIndex + 1).padStart(2, '0')} / {ROUND_LENGTH}</Text>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
            </View>
            <Text style={styles.question}>{t.playerQuestionPrompt}</Text>

            <View style={styles.cluesHeader}>
              <Text style={styles.cluesHeaderText}>{t.playerClueCounter} {revealStage + 1} / 5</Text>
              <Text style={styles.pointsAvailable}>{t.pointsAvailable}: {pointsAvailable}</Text>
            </View>
            <View style={styles.cluesPanel}>
              {visibleClues.map((clue, index) => (
                <View key={clue.key} style={[styles.clueRow, index === visibleClues.length - 1 && styles.clueRowLast]}>
                  <Text style={styles.clueIcon}>{clue.icon}</Text>
                  <Text style={styles.clueLabel}>{clue.label}</Text>
                  <Text style={styles.clueValue} numberOfLines={2}>{clue.value}</Text>
                </View>
              ))}
            </View>

            {selectedAnswer === null && revealStage < 4 ? (
              <Pressable onPress={() => setRevealStage((stage) => Math.min(stage + 1, 4))} style={styles.revealButton}>
                <Text style={styles.revealButtonText}>{t.revealNextClue}</Text>
              </Pressable>
            ) : selectedAnswer === null ? (
              <Text style={styles.allCluesText}>{t.allCluesRevealed}</Text>
            ) : null}

            <Text style={styles.instruction}>{t.selectAnswer}</Text>
            <View style={styles.answers}>
              {question.options.map((answer, index) => {
                const selected = selectedAnswer === answer.id;
                const correct = selectedAnswer !== null && answer.id === question.player.id;
                const wrongSelected = selected && !isCorrect;
                return (
                  <Pressable
                    key={answer.id}
                    disabled={selectedAnswer !== null}
                    onPress={() => setSelectedAnswer(answer.id)}
                    style={[styles.answerButton, selected && styles.answerSelected, correct && styles.answerCorrect, wrongSelected && styles.answerWrong]}
                  >
                    <Text style={styles.answerIndex}>{String.fromCharCode(65 + index)}</Text>
                    <Text style={styles.answerText}>{answer.displayName}</Text>
                    {correct ? <Text style={styles.answerMark}>✓</Text> : null}
                    {wrongSelected ? <Text style={styles.answerMark}>×</Text> : null}
                  </Pressable>
                );
              })}
            </View>

            {selectedAnswer !== null ? (
              <View style={styles.feedback}>
                <Text style={[styles.feedbackTitle, isCorrect ? styles.correctText : styles.wrongText]}>{isCorrect ? t.correct : t.incorrect}</Text>
                {!isCorrect ? (
                  <Text style={styles.feedbackDetail}>{t.correctWas} {question.player.displayName}</Text>
                ) : (
                  <Text style={styles.feedbackDetail}>+{pointsAvailable} {t.pointsLabel}  •  +{XP_PER_CORRECT_ANSWER} XP</Text>
                )}
                <Pressable onPress={continueRound} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>{questionIndex === ROUND_LENGTH - 1 ? t.seeResults : t.continue}  →</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.resultPanel}>
            <Text style={styles.resultEyebrow}>KIT & KICK</Text>
            <Text style={styles.resultTitle}>{t.resultTitle}</Text>
            <Text style={styles.resultScoreLabel}>{t.resultScore}</Text>
            <Text style={styles.resultScore}>{correctCount} / {ROUND_LENGTH}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}><Text style={styles.statValue}>{totalPoints}</Text><Text style={styles.statLabel}>{t.pointsLabel}</Text></View>
              <View style={styles.statCard}><Text style={styles.statValue}>+{totalXp}</Text><Text style={styles.statLabel}>XP</Text></View>
            </View>
            <Text style={styles.resultHint}>{t.correctAnswers}: {correctCount} / {ROUND_LENGTH}</Text>
            <Pressable onPress={restart} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{t.playAgain}</Text></Pressable>
            <Pressable onPress={onBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{t.backHome}</Text></Pressable>
          </View>
        )}
        <Text style={styles.demoNotice}>{t.playerDemoNotice}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: (StatusBar.currentHeight ?? 0) + 12, paddingBottom: 36 },
  header: { flexDirection: 'column', alignItems: 'stretch', marginBottom: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backArrow: { color: colors.iceBlue, fontSize: 30, lineHeight: 30, marginRight: 5 },
  backText: { color: colors.iceBlue, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  roundLabel: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1, textAlign: 'center', marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '900', marginRight: 12 },
  progressTrack: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#243A56', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: colors.electricBlue },
  question: { color: colors.white, fontSize: 22, lineHeight: 27, fontWeight: '900', marginBottom: 12 },
  cluesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cluesHeaderText: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  pointsAvailable: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  cluesPanel: { borderRadius: 15, borderWidth: 1, borderColor: '#294968', backgroundColor: '#102746', paddingHorizontal: 10, paddingVertical: 4, marginBottom: 7 },
  clueRow: { minHeight: 32, flexDirection: 'row', alignItems: 'center', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#29415D' },
  clueRowLast: { borderBottomWidth: 0 },
  clueIcon: { width: 28, fontSize: 16, textAlign: 'center', marginRight: 5 },
  clueLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.3, width: 104 },
  clueValue: { color: colors.white, fontSize: 10, fontWeight: '800', flex: 1, textAlign: 'right' },
  revealButton: { alignSelf: 'center', marginTop: 10, marginBottom: 13, borderRadius: 10, borderWidth: 1, borderColor: '#3C6388', backgroundColor: '#1B3A5B', paddingHorizontal: 15, paddingVertical: 9 },
  revealButtonText: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  allCluesText: { color: '#55D9A2', fontSize: 9, fontWeight: '900', textAlign: 'center', marginTop: 10, marginBottom: 13, letterSpacing: 0.6 },
  instruction: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  answers: { gap: 7 },
  answerButton: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: '#29415D', backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  answerSelected: { borderColor: colors.iceBlue },
  answerCorrect: { borderColor: '#35C98A', backgroundColor: '#123C3A' },
  answerWrong: { borderColor: '#E36A6A', backgroundColor: '#422B3A' },
  answerIndex: { color: colors.iceBlue, fontSize: 11, fontWeight: '900', width: 25 },
  answerText: { color: colors.white, fontSize: 13, fontWeight: '700', flex: 1 },
  answerMark: { color: colors.white, fontSize: 19, fontWeight: '900' },
  feedback: { marginTop: 12, padding: 12, borderRadius: 15, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  feedbackTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  correctText: { color: '#55D9A2' },
  wrongText: { color: '#FF9292' },
  feedbackDetail: { color: colors.white, fontSize: 11, marginTop: 6 },
  primaryButton: { minHeight: 44, borderRadius: 12, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center', marginTop: 13, paddingHorizontal: 16 },
  primaryButtonText: { color: colors.white, fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  resultPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingTop: 30 },
  resultEyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  resultTitle: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 8, marginBottom: 28 },
  resultScoreLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  resultScore: { color: colors.white, fontSize: 48, fontWeight: '900', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 22 },
  statCard: { flex: 1, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', borderRadius: 15, alignItems: 'center', paddingVertical: 16 },
  statValue: { color: colors.gold, fontSize: 23, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 5 },
  resultHint: { color: colors.muted, fontSize: 11, marginTop: 18 },
  secondaryButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: 8, paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.iceBlue, fontSize: 11, fontWeight: '800' },
  demoNotice: { color: '#7186A1', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 14 },
});
