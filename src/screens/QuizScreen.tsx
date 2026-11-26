import React, { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getLocales } from 'expo-localization';
import { colors } from '../theme/colors';
import { resolveLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';
import { playerIdPlayers, type PlayerIdPlayer } from '../data/playerIdPlayers';

const ROUND_LENGTH = 10;
const XP_PER_CORRECT_ANSWER = 25;

type QuizQuestion = {
  player: PlayerIdPlayer;
  options: PlayerIdPlayer[];
};

type Props = {
  onBack: () => void;
};

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRound(): QuizQuestion[] {
  return shuffle(playerIdPlayers)
    .slice(0, ROUND_LENGTH)
    .map((player) => {
      const distractors = shuffle(
        playerIdPlayers.filter((candidate) => candidate.id !== player.id),
      ).slice(0, 3);

      return {
        player,
        options: shuffle([player, ...distractors]),
      };
    });
}

export default function QuizScreen({ onBack }: Props) {
  const deviceLanguage = getLocales()[0]?.languageCode;
  const locale = resolveLocale(deviceLanguage);
  const t = translations[locale];

  const [questions, setQuestions] = useState<QuizQuestion[]>(createRound);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [imageError, setImageError] = useState(false);

  const question = questions[questionIndex];
  const isCorrect = selectedAnswer === question.player.id;
  const progress = ((questionIndex + 1) / ROUND_LENGTH) * 100;

  const restart = () => {
    setQuestions(createRound());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTotalPoints(0);
    setTotalXp(0);
    setShowResult(false);
    setImageError(false);
  };

  const continueRound = () => {
    if (selectedAnswer === null) return;

    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setTotalPoints((value) => value + question.player.points);
      setTotalXp((value) => value + XP_PER_CORRECT_ANSWER);
    }

    if (questionIndex === ROUND_LENGTH - 1) {
      setShowResult(true);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setImageError(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      <ScrollView contentContainerStyle={styles.container}>
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
              <Text style={styles.progressText}>
                {String(questionIndex + 1).padStart(2, '0')} / {ROUND_LENGTH}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <Text style={styles.question}>{t.questionPrompt}</Text>

            <View style={styles.photoPanel}>
              {!imageError && question.player.portraitUrl ? (
                <Image
                  source={{ uri: question.player.portraitUrl }}
                  style={styles.photoImage}
                  resizeMode="contain"
                  accessibilityLabel={question.player.displayName}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={styles.photoFallback}>
                  <Text style={styles.photoEmoji}>⚽</Text>
                  <Text style={styles.photoHint}>{t.photoComingSoon}</Text>
                </View>
              )}
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>TEST IMAGE • RIGHTS PENDING</Text>
              </View>
            </View>

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
                    {t.correctWas} {question.player.displayName}
                  </Text>
                ) : (
                  <Text style={styles.feedbackDetail}>
                    +{question.player.points} {t.pointsLabel}  •  +{XP_PER_CORRECT_ANSWER} XP
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

        <Text style={styles.demoNotice}>{t.demoNotice}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: (StatusBar.currentHeight ?? 0) + 12, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  backArrow: { color: colors.iceBlue, fontSize: 30, lineHeight: 30, marginRight: 5 },
  backText: { color: colors.iceBlue, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  roundLabel: { color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '900', marginRight: 12 },
  progressTrack: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#243A56', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: colors.electricBlue },
  question: { color: colors.white, fontSize: 24, lineHeight: 30, fontWeight: '900', marginBottom: 18 },
  photoPanel: { height: 250, borderRadius: 20, borderWidth: 1, borderColor: '#294968', backgroundColor: '#102746', alignItems: 'center', justifyContent: 'center', marginBottom: 22, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%' },
  photoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
  photoTag: { position: 'absolute', left: 10, bottom: 10, backgroundColor: 'rgba(11, 24, 48, 0.88)', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6 },
  photoTagText: { color: colors.gold, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  photoCircle: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#1B3A5B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  photoEmoji: { fontSize: 38 },
  photoLabel: { color: colors.white, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  photoHint: { color: colors.muted, fontSize: 9, marginTop: 6, textAlign: 'center', paddingHorizontal: 18 },
  instruction: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 10 },
  answers: { gap: 9 },
  answerButton: { minHeight: 52, borderRadius: 13, borderWidth: 1, borderColor: '#29415D', backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  answerSelected: { borderColor: colors.iceBlue },
  answerCorrect: { borderColor: '#35C98A', backgroundColor: '#123C3A' },
  answerWrong: { borderColor: '#E36A6A', backgroundColor: '#422B3A' },
  answerIndex: { color: colors.iceBlue, fontSize: 11, fontWeight: '900', width: 25 },
  answerText: { color: colors.white, fontSize: 13, fontWeight: '700', flex: 1 },
  answerMark: { color: colors.white, fontSize: 19, fontWeight: '900' },
  feedback: { marginTop: 16, padding: 14, borderRadius: 15, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  feedbackTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  correctText: { color: '#55D9A2' },
  wrongText: { color: '#FF9292' },
  feedbackDetail: { color: colors.white, fontSize: 11, marginTop: 6 },
  primaryButton: { minHeight: 48, borderRadius: 13, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center', marginTop: 13, paddingHorizontal: 16 },
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
