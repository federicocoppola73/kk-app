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
import { clubIdClubs, type ClubIdClub } from '../data/clubIdClubs';

const ROUND_LENGTH = 10;
const XP_PER_CORRECT_ANSWER = 25;
const REVEAL_INTERVAL_MS = 4000;

type QuizQuestion = {
  club: ClubIdClub;
  options: ClubIdClub[];
};

type Props = {
  locale: SupportedLocale;
  onBack: () => void;
};

type Clue = { label: string; value: string };

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRound(): QuizQuestion[] {
  return shuffle(clubIdClubs)
    .slice(0, ROUND_LENGTH)
    .map((club) => {
      const distractors = shuffle(clubIdClubs.filter((candidate) => candidate.id !== club.id)).slice(0, 3);
      return { club, options: shuffle([club, ...distractors]) };
    });
}

function getClues(club: ClubIdClub, t: typeof translations.en, locale: SupportedLocale): Clue[] {
  const clues: Clue[] = [
    { label: t.clueCity, value: locale === 'it' ? club.cityIt : club.city },
    { label: t.clueFounded, value: String(club.foundedYear) },
    { label: t.clueColors, value: locale === 'it' ? club.colorsIt : club.colors },
    { label: t.clueStadium, value: club.stadium },
  ];
  if (club.nickname?.trim()) clues.push({ label: t.clueNickname, value: club.nickname });
  return clues;
}

export default function ClubQuizScreen({ locale, onBack }: Props) {
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
  const clues = getClues(question.club, t, locale);
  const isCorrect = selectedAnswer === question.club.id;
  const progress = ((questionIndex + 1) / ROUND_LENGTH) * 100;
  const multipliers = clues.length === 5 ? [1, 0.8, 0.6, 0.4, 0.2] : [1, 0.75, 0.5, 0.25];
  const potentialPoints = Math.round(question.club.points * multipliers[Math.min(revealStage, clues.length - 1)]);

  useEffect(() => {
    if (selectedAnswer !== null || showResult || revealStage >= clues.length - 1) return;
    const timeout = setTimeout(() => {
      setRevealStage((stage) => Math.min(stage + 1, clues.length - 1));
    }, REVEAL_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [questionIndex, selectedAnswer, showResult, revealStage, clues.length]);

  const revealNextClue = () => {
    setRevealStage((stage) => Math.min(stage + 1, clues.length - 1));
  };

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
      setTotalPoints((value) => value + potentialPoints);
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Home</Text>
          </Pressable>
          <Text style={styles.roundLabel}>{t.clubIdRound}</Text>
        </View>

        {!showResult ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {String(questionIndex + 1).padStart(2, '0')} / {ROUND_LENGTH}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <Text style={styles.question}>{t.clubQuestionPrompt}</Text>

            <View style={styles.cluesPanel}>
              {clues.slice(0, revealStage + 1).map((clue, index) => (
                <View key={clue.label} style={styles.clueRow}>
                  <View style={styles.clueNumber}>
                    <Text style={styles.clueNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.clueContent}>
                    <Text style={styles.clueLabel}>{clue.label}</Text>
                    <Text style={styles.clueValue}>{clue.value}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.clueFooter}>
                <Text style={styles.clueCount}>{t.clueCounter} {revealStage + 1}/{clues.length}</Text>
                <Text style={styles.revealPoints}>{t.pointsAvailable}: {potentialPoints}</Text>
              </View>
            </View>

            <View style={styles.revealControls}>
              {revealStage < clues.length - 1 ? (
                <Pressable onPress={revealNextClue} style={styles.revealButton}>
                  <Text style={styles.revealButtonText}>{t.revealNextClue}</Text>
                </Pressable>
              ) : (
                <Text style={styles.revealComplete}>{t.allCluesRevealed}</Text>
              )}
            </View>

            <Text style={styles.instruction}>{t.selectAnswer}</Text>
            <View style={styles.answers}>
              {question.options.map((answer, index) => {
                const selected = selectedAnswer === answer.id;
                const correct = selectedAnswer !== null && answer.id === question.club.id;
                const wrongSelected = selected && !isCorrect;

                return (
                  <Pressable
                    key={answer.id}
                    disabled={selectedAnswer !== null}
                    onPress={() => setSelectedAnswer(answer.id)}
                    style={[
                      styles.answerButton,
                      selected && styles.answerSelected,
                      correct && styles.answerCorrect,
                      wrongSelected && styles.answerWrong,
                    ]}
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
                <Text style={[styles.feedbackTitle, isCorrect ? styles.correctText : styles.wrongText]}>
                  {isCorrect ? t.correct : t.incorrect}
                </Text>
                {!isCorrect ? (
                  <Text style={styles.feedbackDetail}>
                    {t.correctWas} {question.club.displayName}
                  </Text>
                ) : (
                  <Text style={styles.feedbackDetail}>
                    +{potentialPoints} {t.pointsLabel}  •  +{XP_PER_CORRECT_ANSWER} XP
                  </Text>
                )}
                <Pressable onPress={continueRound} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>
                    {questionIndex === ROUND_LENGTH - 1 ? t.seeResults : t.continue}  →
                  </Text>
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
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalPoints}</Text>
                <Text style={styles.statLabel}>{t.pointsLabel}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>+{totalXp}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>
            <Text style={styles.resultHint}>
              {t.correctAnswers}: {correctCount} / {ROUND_LENGTH}
            </Text>
            <Pressable onPress={restart} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t.playAgain}</Text>
            </Pressable>
            <Pressable onPress={onBack} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t.backHome}</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.clubDemoNotice}>{t.clubDemoNotice}</Text>
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
  backText: { color: colors.iceBlue, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  roundLabel: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1, textAlign: 'center', marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '900', marginRight: 12 },
  progressTrack: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#243A56', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: colors.electricBlue },
  question: { color: colors.white, fontSize: 22, lineHeight: 27, fontWeight: '900', marginBottom: 12 },
  cluesPanel: { borderRadius: 20, borderWidth: 1, borderColor: '#294968', backgroundColor: '#102746', padding: 14, marginBottom: 10 },
  clueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#29415D' },
  clueNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1B3A5B', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  clueNumberText: { color: colors.iceBlue, fontSize: 11, fontWeight: '900' },
  clueContent: { flex: 1 },
  clueLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 3 },
  clueValue: { color: colors.white, fontSize: 15, fontWeight: '800' },
  clueFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
  clueCount: { color: colors.muted, fontSize: 9, fontWeight: '800' },
  revealControls: { alignItems: 'center', marginBottom: 13 },
  revealPoints: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },
  revealButton: { backgroundColor: '#1B3A5B', borderWidth: 1, borderColor: '#3C6388', borderRadius: 9, paddingHorizontal: 16, paddingVertical: 10 },
  revealButtonText: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  revealComplete: { color: '#55D9A2', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
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
  clubDemoNotice: { color: '#7186A1', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 14 },
});
