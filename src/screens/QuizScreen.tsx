import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getLocales } from 'expo-localization';
import { colors } from '../theme/colors';
import { resolveLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';

const answers = ['Cristiano Ronaldo', 'Lionel Messi', 'Kylian Mbappé', 'Erling Haaland'];
const correctAnswer = 'Lionel Messi';

type Props = {
  onBack: () => void;
};

export default function QuizScreen({ onBack }: Props) {
  const deviceLanguage = getLocales()[0]?.languageCode;
  const locale = resolveLocale(deviceLanguage);
  const t = translations[locale];

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selectedAnswer === correctAnswer;

  const restart = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>{t.backHome}</Text>
          </Pressable>
          <Text style={styles.roundLabel}>{t.demoLabel}</Text>
        </View>

        {!showResult ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>01 / 01</Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <Text style={styles.question}>{t.questionPrompt}</Text>

            <View style={styles.photoPanel}>
              <View style={styles.photoCircle}>
                <Text style={styles.photoEmoji}>⚽</Text>
              </View>
              <Text style={styles.photoLabel}>{t.photoPlaceholder}</Text>
              <Text style={styles.photoHint}>{t.photoComingSoon}</Text>
            </View>

            <Text style={styles.instruction}>{t.selectAnswer}</Text>
            <View style={styles.answers}>
              {answers.map((answer, index) => {
                const selected = selectedAnswer === answer;
                const correct = selectedAnswer !== null && answer === correctAnswer;
                const wrongSelected = selected && answer !== correctAnswer;
                return (
                  <Pressable
                    key={answer}
                    disabled={selectedAnswer !== null}
                    onPress={() => setSelectedAnswer(answer)}
                    style={[
                      styles.answerButton,
                      selected && styles.answerSelected,
                      correct && styles.answerCorrect,
                      wrongSelected && styles.answerWrong,
                    ]}
                  >
                    <Text style={styles.answerIndex}>{String.fromCharCode(65 + index)}</Text>
                    <Text style={styles.answerText}>{answer}</Text>
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
                  <Text style={styles.feedbackDetail}>{t.correctWas} {correctAnswer}</Text>
                ) : null}
                <Pressable onPress={() => setShowResult(true)} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>{t.continue}  →</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.resultPanel}>
            <Text style={styles.resultEyebrow}>KIT & KICK</Text>
            <Text style={styles.resultTitle}>{t.resultTitle}</Text>
            <Text style={styles.resultScoreLabel}>{t.resultScore}</Text>
            <Text style={styles.resultScore}>{isCorrect ? '1 / 1' : '0 / 1'}</Text>
            <View style={styles.xpPill}>
              <Text style={styles.xpText}>{t.earnedXp}: +{isCorrect ? 25 : 0} XP</Text>
            </View>
            <Pressable onPress={restart} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t.playAgain}</Text>
            </Pressable>
            <Pressable onPress={onBack} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t.backHome}</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.demoNotice}>{t.demoNotice}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  backArrow: { color: colors.iceBlue, fontSize: 30, lineHeight: 30, marginRight: 5 },
  backText: { color: colors.iceBlue, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  roundLabel: { color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '900', marginRight: 12 },
  progressTrack: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#243A56', overflow: 'hidden' },
  progressFill: { width: '100%', height: 5, borderRadius: 5, backgroundColor: colors.electricBlue },
  question: { color: colors.white, fontSize: 24, lineHeight: 30, fontWeight: '900', marginBottom: 18 },
  photoPanel: { height: 205, borderRadius: 20, borderWidth: 1, borderColor: '#294968', backgroundColor: '#102746', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
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
  resultPanel: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },
  resultEyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  resultTitle: { color: colors.white, fontSize: 26, fontWeight: '900', marginTop: 8, marginBottom: 28 },
  resultScoreLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  resultScore: { color: colors.white, fontSize: 48, fontWeight: '900', marginTop: 4 },
  xpPill: { backgroundColor: '#3B3425', borderWidth: 1, borderColor: '#725B2B', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18, marginTop: 18 },
  xpText: { color: colors.gold, fontSize: 12, fontWeight: '900' },
  secondaryButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', marginTop: 8, paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.iceBlue, fontSize: 11, fontWeight: '800' },
  demoNotice: { color: '#7186A1', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 14 },
});
