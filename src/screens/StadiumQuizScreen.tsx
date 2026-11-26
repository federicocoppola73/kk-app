import React, { useEffect, useMemo, useState } from 'react';
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
import { useQuizExitConfirmation } from '../hooks/useQuizExitConfirmation';
import { stadiums, type Stadium } from '../data/stadiums';

const ROUND_LENGTH = 10;
const XP_PER_CORRECT_ANSWER = 25;
const REVEAL_INTERVAL_MS = 4000;
const POINTS_BY_CLUE = [200, 160, 120, 80, 40];

type QuizQuestion = { stadium: Stadium; options: Stadium[] };
type Props = { locale: SupportedLocale; onBack: () => void };
type Clue = { icon: string; label: string; value: string };

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRound(): QuizQuestion[] {
  return shuffle(stadiums).slice(0, ROUND_LENGTH).flatMap((stadium) => {
    const otherStadiums = stadiums.filter((candidate) => candidate.id !== stadium.id);
    const sameCity = shuffle(otherStadiums.filter(
      (candidate) => candidate.city === stadium.city && candidate.country === stadium.country,
    ));
    const sameCountry = shuffle(otherStadiums.filter(
      (candidate) => candidate.country === stadium.country && candidate.city !== stadium.city,
    ));
    const distractors = [...sameCity, ...sameCountry].slice(0, 3);

    // Never serve a question with fewer than three geographically valid distractors.
    if (distractors.length !== 3) return [];
    return [{ stadium, options: shuffle([stadium, ...distractors]) }];
  });
}

function getClues(stadium: Stadium, t: typeof translations.en, locale: SupportedLocale): Clue[] {
  return [
    { icon: '📅', label: t.clueOpened, value: String(stadium.openedYear) },
    { icon: '👥', label: t.clueCapacity, value: locale === 'it' ? stadium.capacityIt : stadium.capacityEn },
    { icon: '🏆', label: t.clueEvent, value: locale === 'it' ? stadium.eventIt : stadium.eventEn },
    { icon: '📍', label: t.clueLocation, value: locale === 'it' ? stadium.cityIt + ', ' + stadium.countryIt : stadium.city + ', ' + stadium.country },
    { icon: '⚽', label: t.clueHomeTeams, value: (locale === 'it' ? stadium.homeTeamsIt : stadium.homeTeamsEn).join(', ') },
  ];
}

function StadiumIllustration() {
  return (
    <View style={styles.illustration}>
      <View style={styles.standTop} />
      <View style={styles.standLeft} />
      <View style={styles.standRight} />
      <View style={styles.pitch}>
        <View style={styles.pitchLine} />
        <View style={styles.pitchCircle} />
        <View style={styles.pitchBoxTop} />
        <View style={styles.pitchBoxBottom} />
      </View>
      <View style={styles.standBottom} />
      <Text style={styles.illustrationCaption}>STADIUM ILLUSTRATION</Text>
    </View>
  );
}

export default function StadiumQuizScreen({ locale, onBack }: Props) {
  const t = translations[locale];
  const [questions, setQuestions] = useState<QuizQuestion[]>(createRound);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const handleBack = useQuizExitConfirmation(locale, showResult, onBack);
  const [revealStage, setRevealStage] = useState(0);

  const question = questions[questionIndex];
  const clues = useMemo(() => question ? getClues(question.stadium, t, locale) : [], [question, t, locale]);
  const isCorrect = selectedAnswer === question?.stadium.id;
  const progress = ((questionIndex + 1) / ROUND_LENGTH) * 100;
  const potentialPoints = POINTS_BY_CLUE[Math.min(revealStage, POINTS_BY_CLUE.length - 1)];

  useEffect(() => {
    if (selectedAnswer !== null || showResult || revealStage >= 4) return;
    const timeout = setTimeout(() => setRevealStage((stage) => Math.min(stage + 1, 4)), REVEAL_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [questionIndex, selectedAnswer, showResult, revealStage]);

  const revealNextClue = () => setRevealStage((stage) => Math.min(stage + 1, 4));

  const restart = () => {
    const nextRound = createRound();
    if (nextRound.length !== ROUND_LENGTH) return;
    setQuestions(nextRound);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTotalPoints(0);
    setTotalXp(0);
    setShowResult(false);
    setRevealStage(0);
  };

  const continueRound = () => {
    if (selectedAnswer === null || !question) return;
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setTotalPoints((value) => value + potentialPoints);
      setTotalXp((value) => value + XP_PER_CORRECT_ANSWER);
    }
    if (questionIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setRevealStage(0);
  };

  if (!question) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>{t.backHome}</Text>
          </Pressable>
          <Text style={styles.roundLabel}>{t.stadiumIdRound}</Text>
        </View>

        {!showResult ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{String(questionIndex + 1).padStart(2, '0')} / {questions.length}</Text>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progress + '%' }]} /></View>
            </View>

            <Text style={styles.question}>{t.stadiumQuestionPrompt}</Text>
            <StadiumIllustration />

            <View style={styles.cluesPanel}>
              {clues.slice(0, revealStage + 1).map((clue) => (
                <View key={clue.label} style={styles.clueRow}>
                  <Text style={styles.clueIcon}>{clue.icon}</Text>
                  <Text style={styles.clueLabel}>{clue.label}</Text>
                  <Text style={styles.clueValue} numberOfLines={2}>{clue.value}</Text>
                </View>
              ))}
              <View style={styles.clueFooter}>
                <Text style={styles.clueCount}>{t.clueCounter} {revealStage + 1}/5</Text>
                <Text style={styles.revealPoints}>{t.pointsAvailable}: {potentialPoints}</Text>
              </View>
            </View>

            {selectedAnswer === null ? (
              <View style={styles.revealControls}>
                {revealStage < 4 ? (
                  <Pressable onPress={revealNextClue} style={styles.revealButton}>
                    <Text style={styles.revealButtonText}>{t.revealNextClue}</Text>
                  </Pressable>
                ) : <Text style={styles.revealComplete}>{t.allCluesRevealed}</Text>}
              </View>
            ) : null}

            <Text style={styles.instruction}>{t.selectAnswer}</Text>
            <View style={styles.answers}>
              {question.options.map((answer, index) => {
                const selected = selectedAnswer === answer.id;
                const correct = selectedAnswer !== null && answer.id === question.stadium.id;
                const wrongSelected = selected && !isCorrect;
                return (
                  <Pressable
                    key={answer.id}
                    disabled={selectedAnswer !== null}
                    onPress={() => setSelectedAnswer(answer.id)}
                    style={[styles.answerButton, selected && styles.answerSelected, correct && styles.answerCorrect, wrongSelected && styles.answerWrong]}
                  >
                    <Text style={styles.answerIndex}>{String.fromCharCode(65 + index)}</Text>
                    <Text style={styles.answerText}>{answer.name}</Text>
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
                  <Text style={styles.feedbackDetail}>{t.correctWas} {question.stadium.name}</Text>
                ) : (
                  <Text style={styles.feedbackDetail}>+{potentialPoints} {t.pointsLabel}  •  +{XP_PER_CORRECT_ANSWER} XP</Text>
                )}
                <Pressable onPress={continueRound} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>{questionIndex === questions.length - 1 ? t.seeResults : t.continue}  →</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.resultPanel}>
            <Text style={styles.resultEyebrow}>KIT & KICK</Text>
            <Text style={styles.resultTitle}>{t.resultTitle}</Text>
            <Text style={styles.resultScoreLabel}>{t.resultScore}</Text>
            <Text style={styles.resultScore}>{correctCount} / {questions.length}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}><Text style={styles.statValue}>{totalPoints}</Text><Text style={styles.statLabel}>{t.pointsLabel}</Text></View>
              <View style={styles.statCard}><Text style={styles.statValue}>+{totalXp}</Text><Text style={styles.statLabel}>XP</Text></View>
            </View>
            <Text style={styles.resultHint}>{t.correctAnswers}: {correctCount} / {questions.length}</Text>
            <Pressable onPress={restart} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{t.playAgain}</Text></Pressable>
            <Pressable onPress={handleBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{t.backHome}</Text></Pressable>
          </View>
        )}

        <Text style={styles.demoNotice}>{t.stadiumDemoNotice}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: (StatusBar.currentHeight ?? 0) + 8, paddingBottom: 22 },
  header: { flexDirection: 'column', alignItems: 'stretch', marginBottom: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 5 },
  backArrow: { color: colors.iceBlue, fontSize: 30, lineHeight: 30, marginRight: 5 },
  backText: { color: colors.iceBlue, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  roundLabel: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1, textAlign: 'center', marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '900', marginRight: 12 },
  progressTrack: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#243A56', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: colors.electricBlue },
  question: { color: colors.white, fontSize: 19, lineHeight: 23, fontWeight: '900', marginBottom: 8 },
  illustration: { height: 112, borderRadius: 15, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 8, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  standTop: { position: 'absolute', top: 9, left: 36, right: 36, height: 22, borderWidth: 5, borderColor: '#47749B', borderBottomWidth: 0, borderTopLeftRadius: 48, borderTopRightRadius: 48 },
  standLeft: { position: 'absolute', left: 18, top: 25, width: 25, height: 55, borderWidth: 5, borderColor: '#47749B', borderRightWidth: 0, borderTopLeftRadius: 22, borderBottomLeftRadius: 22 },
  standRight: { position: 'absolute', right: 18, top: 25, width: 25, height: 55, borderWidth: 5, borderColor: '#47749B', borderLeftWidth: 0, borderTopRightRadius: 22, borderBottomRightRadius: 22 },
  pitch: { width: '66%', height: 58, backgroundColor: '#1C805D', borderWidth: 2, borderColor: '#A8D9C0', borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  pitchLine: { position: 'absolute', width: 1, height: '100%', backgroundColor: '#A8D9C0' },
  pitchCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#A8D9C0' },
  pitchBoxTop: { position: 'absolute', top: 0, width: 34, height: 9, borderWidth: 1, borderColor: '#A8D9C0', borderTopWidth: 0 },
  pitchBoxBottom: { position: 'absolute', bottom: 0, width: 34, height: 9, borderWidth: 1, borderColor: '#A8D9C0', borderBottomWidth: 0 },
  standBottom: { position: 'absolute', bottom: 8, left: 36, right: 36, height: 12, borderWidth: 4, borderColor: '#47749B', borderTopWidth: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  illustrationCaption: { position: 'absolute', bottom: 3, right: 8, color: '#AFC9E8', fontSize: 6, fontWeight: '900', letterSpacing: 1 },
  cluesPanel: { borderRadius: 15, borderWidth: 1, borderColor: '#294968', backgroundColor: '#102746', paddingHorizontal: 10, paddingVertical: 4, marginBottom: 7 },
  clueRow: { minHeight: 32, flexDirection: 'row', alignItems: 'center', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#29415D' },
  clueIcon: { width: 28, fontSize: 16, textAlign: 'center', marginRight: 5 },
  clueLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.3, width: 104 },
  clueValue: { color: colors.white, fontSize: 10, fontWeight: '800', flex: 1, textAlign: 'right' },
  clueFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, paddingBottom: 2 },
  clueCount: { color: colors.muted, fontSize: 9, fontWeight: '800' },
  revealPoints: { color: colors.gold, fontSize: 9, fontWeight: '900' },
  revealControls: { alignItems: 'center', marginBottom: 7 },
  revealButton: { backgroundColor: '#1B3A5B', borderWidth: 1, borderColor: '#3C6388', borderRadius: 9, paddingHorizontal: 15, paddingVertical: 9 },
  revealButtonText: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  revealComplete: { color: '#55D9A2', fontSize: 9, fontWeight: '900' },
  instruction: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginBottom: 7 },
  answers: { gap: 6 },
  answerButton: { minHeight: 42, borderRadius: 11, borderWidth: 1, borderColor: '#29415D', backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11 },
  answerSelected: { borderColor: colors.iceBlue },
  answerCorrect: { borderColor: '#35C98A', backgroundColor: '#123C3A' },
  answerWrong: { borderColor: '#E36A6A', backgroundColor: '#422B3A' },
  answerIndex: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', width: 23 },
  answerText: { color: colors.white, fontSize: 11, fontWeight: '700', flex: 1 },
  answerMark: { color: colors.white, fontSize: 18, fontWeight: '900' },
  feedback: { marginTop: 10, padding: 11, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  feedbackTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  correctText: { color: '#55D9A2' },
  wrongText: { color: '#FF9292' },
  feedbackDetail: { color: colors.white, fontSize: 10, marginTop: 5 },
  primaryButton: { minHeight: 42, borderRadius: 11, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center', marginTop: 11, paddingHorizontal: 15 },
  primaryButtonText: { color: colors.white, fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  resultPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingTop: 30 },
  resultEyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  resultTitle: { color: colors.white, fontSize: 25, fontWeight: '900', marginTop: 8, marginBottom: 25 },
  resultScoreLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  resultScore: { color: colors.white, fontSize: 46, fontWeight: '900', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 20 },
  statCard: { flex: 1, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', borderRadius: 14, alignItems: 'center', paddingVertical: 15 },
  statValue: { color: colors.gold, fontSize: 22, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 5 },
  resultHint: { color: colors.muted, fontSize: 10, marginTop: 16 },
  secondaryButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 7, paddingHorizontal: 15 },
  secondaryButtonText: { color: colors.iceBlue, fontSize: 10, fontWeight: '800' },
  demoNotice: { color: '#7186A1', fontSize: 8, lineHeight: 13, textAlign: 'center', marginTop: 12 },
});
