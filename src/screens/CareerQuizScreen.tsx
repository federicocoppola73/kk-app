import React, { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';
import { useQuizExitConfirmation } from '../hooks/useQuizExitConfirmation';
import { auth } from '../services/firebase';
import { calculateQuizXp, createQuizResultId, recordCompletedQuiz } from '../services/quizResults';
import { careerPlayers, type CareerPlayer } from '../data/careerPaths';

const ROUND_LENGTH = 10;
const REVEAL_INTERVAL_MS = 4000;
const POINTS = [200, 160, 120, 80, 40];

type Question = { player: CareerPlayer; options: CareerPlayer[] };
type Props = { locale: SupportedLocale; onBack: () => void };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function similarity(a: CareerPlayer, b: CareerPlayer): number {
  const aClubs = new Set(a.clubs.map((club) => club.name));
  return b.clubs.reduce((score, club) => score + (aClubs.has(club.name) ? 1 : 0), 0);
}

function createRound(): Question[] {
  return shuffle(careerPlayers).slice(0, ROUND_LENGTH).map((player) => {
    const candidates = careerPlayers.filter((candidate) => candidate.id !== player.id)
      .map((candidate) => ({ candidate, score: similarity(player, candidate) }))
      .sort((a, b) => b.score - a.score);
    const top = candidates.slice(0, Math.min(8, candidates.length));
    const distractors = shuffle(top).slice(0, 3).map((item) => item.candidate);
    return { player, options: shuffle([player, ...distractors]) };
  });
}

export default function CareerQuizScreen({ locale, onBack }: Props) {
  const t = translations[locale];
  const [questions, setQuestions] = useState<Question[]>(createRound);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const handleBack = useQuizExitConfirmation(locale, showResult, onBack);
  const resultIdRef = useRef<string | null>(null);
  const [revealStage, setRevealStage] = useState(1);

  useEffect(() => {
    if (!showResult) return;

    const user = auth.currentUser;
    if (!user) {
      console.warn('Quiz result was not saved because no authenticated user is available.');
      return;
    }

    const resultId = resultIdRef.current ?? createQuizResultId(user.uid);
    resultIdRef.current = resultId;

    void recordCompletedQuiz(user.uid, resultId, {
      mode: 'career',
      points: totalPoints,
      correctAnswers: correctCount,
      totalQuestions: ROUND_LENGTH,
    }).catch((error) => {
      console.warn('Unable to save completed quiz result:', error);
    });
  }, [showResult, totalPoints, correctCount]);

  const question = questions[questionIndex];
  const visibleClubs = question.player.clubs.slice(0, revealStage);
  const potentialPoints = POINTS[Math.min(revealStage - 1, POINTS.length - 1)];

  useEffect(() => {
    if (selectedAnswer !== null || showResult || revealStage >= question.player.clubs.length) return;
    const timeout = setTimeout(() => setRevealStage((stage) => Math.min(stage + 1, question.player.clubs.length)), REVEAL_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [questionIndex, selectedAnswer, showResult, revealStage, question.player.clubs.length]);

  const continueRound = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.player.id) {
      setCorrectCount((value) => value + 1);
      setTotalPoints((value) => value + potentialPoints);
    }
    if (questionIndex === ROUND_LENGTH - 1) {
      setShowResult(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setRevealStage(1);
  };

  const restart = () => {
    setQuestions(createRound());
    resultIdRef.current = null;
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setTotalPoints(0);
    setShowResult(false);
    setRevealStage(1);
  };

  const isCorrect = selectedAnswer === question.player.id;
  const progress = ((questionIndex + 1) / ROUND_LENGTH) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={10} style={styles.backButton}><Text style={styles.backArrow}>‹</Text><Text style={styles.backText}>{t.backHome}</Text></Pressable>
          <Text style={styles.roundLabel}>{t.careerIdRound}</Text>
        </View>
        {!showResult ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{String(questionIndex + 1).padStart(2, '0')} / {ROUND_LENGTH}</Text>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
            </View>
            <Text style={styles.question}>{t.careerQuestionPrompt}</Text>
            <View style={styles.timeline}>
              {visibleClubs.map((club, index) => (
                <View key={`${club.name}-${index}`} style={styles.clubRow}>
                  <View style={styles.timelineMarker}><View style={styles.dot} />{index < visibleClubs.length - 1 ? <View style={styles.line} /> : null}</View>
                  <View style={styles.clubCopy}>
                    <View style={styles.clubTop}>
                      <Text style={styles.flag}>{club.flag}</Text>
                      <Text style={styles.clubName}>{club.name}</Text>
                      <Text style={styles.years}>{club.from}–{club.to}</Text>
                    </View>
                    {club.loan ? <Text style={styles.loan}>{t.careerLoan}</Text> : null}
                  </View>
                </View>
              ))}
              <View style={styles.timelineFooter}>
                <Text style={styles.counter}>{t.careerClueCounter}: {revealStage}/{question.player.clubs.length}</Text>
                <Text style={styles.points}>{t.pointsAvailable}: {potentialPoints}</Text>
              </View>
            </View>
            {selectedAnswer === null ? (
              <Pressable disabled={revealStage >= question.player.clubs.length} onPress={() => setRevealStage((stage) => Math.min(stage + 1, question.player.clubs.length))} style={[styles.revealButton, revealStage >= question.player.clubs.length && styles.disabledButton]}>
                <Text style={styles.revealButtonText}>{revealStage >= question.player.clubs.length ? t.allCluesRevealed : t.revealNextClue}</Text>
              </Pressable>
            ) : null}
            <Text style={styles.instruction}>{t.selectAnswer}</Text>
            <View style={styles.answers}>
              {question.options.map((answer, index) => {
                const selected = selectedAnswer === answer.id;
                const correct = selectedAnswer !== null && answer.id === question.player.id;
                return <Pressable key={answer.id} disabled={selectedAnswer !== null} onPress={() => setSelectedAnswer(answer.id)} style={[styles.answerButton, selected && styles.answerSelected, correct && styles.answerCorrect, selected && !isCorrect && styles.answerWrong]}>
                  <Text style={styles.answerIndex}>{String.fromCharCode(65 + index)}</Text><Text style={styles.answerText}>{answer.name}</Text>{correct ? <Text style={styles.answerMark}>✓</Text> : null}{selected && !isCorrect ? <Text style={styles.answerMark}>×</Text> : null}
                </Pressable>;
              })}
            </View>
            {selectedAnswer !== null ? <View style={styles.feedback}>
              <Text style={[styles.feedbackTitle, isCorrect ? styles.correctText : styles.wrongText]}>{isCorrect ? t.correct : t.incorrect}</Text>
              {!isCorrect ? <Text style={styles.feedbackDetail}>{t.correctWas} {question.player.name}</Text> : <Text style={styles.feedbackDetail}>+{potentialPoints} {t.pointsLabel}</Text>}
              <Pressable onPress={continueRound} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{questionIndex === ROUND_LENGTH - 1 ? t.seeResults : t.continue} →</Text></Pressable>
            </View> : null}
          </>
        ) : (
          <View style={styles.resultPanel}>
            <Text style={styles.resultEyebrow}>KIT & KICK</Text><Text style={styles.resultTitle}>{t.resultTitle}</Text>
            <Text style={styles.resultScoreLabel}>{t.resultScore}</Text><Text style={styles.resultScore}>{correctCount} / {ROUND_LENGTH}</Text>
            <View style={styles.statsRow}><View style={styles.statCard}><Text style={styles.statValue}>{totalPoints}</Text><Text style={styles.statLabel}>{t.pointsLabel}</Text></View><View style={styles.statCard}><Text style={styles.statValue}>+{calculateQuizXp(correctCount)}</Text><Text style={styles.statLabel}>XP</Text></View></View>
            <Text style={styles.resultHint}>{t.correctAnswers}: {correctCount} / {ROUND_LENGTH}</Text>
            <Pressable onPress={restart} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{t.playAgain}</Text></Pressable>
            <Pressable onPress={handleBack} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{t.backHome}</Text></Pressable>
          </View>
        )}
        <Text style={styles.notice}>{t.careerDemoNotice}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 safeArea:{flex:1,backgroundColor:colors.midnightNavy},
 container:{flexGrow:1,paddingHorizontal:20,paddingTop:(StatusBar.currentHeight??0)+8,paddingBottom:22},
 header:{marginBottom:12},backButton:{flexDirection:'row',alignItems:'center',alignSelf:'flex-start',paddingVertical:6},
 backArrow:{color:colors.iceBlue,fontSize:30,lineHeight:30,marginRight:5},backText:{color:colors.iceBlue,fontSize:10,fontWeight:'800'},
 roundLabel:{color:colors.gold,fontSize:11,fontWeight:'900',letterSpacing:1,textAlign:'center',marginTop:2},
 progressRow:{flexDirection:'row',alignItems:'center',marginBottom:10},progressText:{color:colors.muted,fontSize:10,fontWeight:'900',marginRight:12},
 progressTrack:{flex:1,height:5,borderRadius:5,backgroundColor:'#243A56',overflow:'hidden'},progressFill:{height:5,borderRadius:5,backgroundColor:colors.electricBlue},
 question:{color:colors.white,fontSize:19,lineHeight:24,fontWeight:'900',marginBottom:10},
 timeline:{backgroundColor:'#102746',borderWidth:1,borderColor:'#294968',borderRadius:16,paddingHorizontal:12,paddingTop:12,paddingBottom:8,marginBottom:10},
 clubRow:{flexDirection:'row',minHeight:43},timelineMarker:{width:18,alignItems:'center'},dot:{width:8,height:8,borderRadius:4,backgroundColor:colors.iceBlue,marginTop:6},line:{width:2,flex:1,backgroundColor:'#41617F',marginTop:2},
 clubCopy:{flex:1,paddingBottom:8,borderBottomWidth:1,borderBottomColor:'#29415D',marginLeft:7},clubTop:{flexDirection:'row',alignItems:'center',minHeight:23},
 flag:{fontSize:16,width:25},clubName:{color:colors.white,fontSize:12,fontWeight:'800',flex:1},years:{color:colors.iceBlue,fontSize:11,fontWeight:'900',fontVariant:['tabular-nums']},
 loan:{color:colors.gold,fontSize:8,fontWeight:'900',letterSpacing:0.8,marginTop:2},
 timelineFooter:{flexDirection:'row',justifyContent:'space-between',paddingTop:9},counter:{color:colors.muted,fontSize:9,fontWeight:'800'},points:{color:colors.gold,fontSize:10,fontWeight:'900'},
 revealButton:{alignSelf:'center',backgroundColor:'#1B3A5B',borderWidth:1,borderColor:'#3C6388',borderRadius:9,paddingHorizontal:16,paddingVertical:10,marginBottom:10},
 revealButtonText:{color:colors.iceBlue,fontSize:10,fontWeight:'900',letterSpacing:0.5},disabledButton:{opacity:0.5},
 instruction:{color:colors.muted,fontSize:10,fontWeight:'900',letterSpacing:1,marginBottom:8},
 answers:{gap:7},answerButton:{minHeight:46,borderRadius:12,borderWidth:1,borderColor:'#29415D',backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',paddingHorizontal:12},
 answerSelected:{borderColor:colors.iceBlue},answerCorrect:{borderColor:'#35C98A',backgroundColor:'#123C3A'},answerWrong:{borderColor:'#E36A6A',backgroundColor:'#422B3A'},
 answerIndex:{color:colors.iceBlue,fontSize:11,fontWeight:'900',width:25},answerText:{color:colors.white,fontSize:13,fontWeight:'700',flex:1},answerMark:{color:colors.white,fontSize:19,fontWeight:'900'},
 feedback:{marginTop:12,padding:12,borderRadius:15,backgroundColor:'#102746',borderWidth:1,borderColor:'#294968'},
 feedbackTitle:{fontSize:13,fontWeight:'900',letterSpacing:0.8},correctText:{color:'#55D9A2'},wrongText:{color:'#FF9292'},feedbackDetail:{color:colors.white,fontSize:11,marginTop:6},
 primaryButton:{minHeight:44,borderRadius:12,backgroundColor:colors.electricBlue,alignItems:'center',justifyContent:'center',marginTop:13,paddingHorizontal:16},primaryButtonText:{color:colors.white,fontSize:12,fontWeight:'900',letterSpacing:0.8},
 resultPanel:{flex:1,justifyContent:'center',alignItems:'center',paddingHorizontal:12,paddingTop:30},resultEyebrow:{color:colors.iceBlue,fontSize:10,fontWeight:'900',letterSpacing:2},
 resultTitle:{color:colors.white,fontSize:26,fontWeight:'900',marginTop:8,marginBottom:28},resultScoreLabel:{color:colors.muted,fontSize:10,fontWeight:'900',letterSpacing:1},resultScore:{color:colors.white,fontSize:48,fontWeight:'900',marginTop:4},
 statsRow:{flexDirection:'row',gap:12,width:'100%',marginTop:22},statCard:{flex:1,backgroundColor:'#102746',borderWidth:1,borderColor:'#294968',borderRadius:15,alignItems:'center',paddingVertical:16},
 statValue:{color:colors.gold,fontSize:23,fontWeight:'900'},statLabel:{color:colors.muted,fontSize:9,fontWeight:'900',letterSpacing:1,marginTop:5},resultHint:{color:colors.muted,fontSize:11,marginTop:18},
 secondaryButton:{minHeight:46,alignItems:'center',justifyContent:'center',marginTop:8,paddingHorizontal:16},secondaryButtonText:{color:colors.iceBlue,fontSize:11,fontWeight:'800'},
 notice:{color:'#7186A1',fontSize:9,lineHeight:14,textAlign:'center',marginTop:14}
});
