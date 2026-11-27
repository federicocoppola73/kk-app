import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { syncLeaderboardEntry } from './userProfile';

export type QuizMode = 'player' | 'club' | 'career' | 'stadium';

export type CompletedQuizResult = {
  mode: QuizMode;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
};

export type RecordQuizResultOutcome = 'created' | 'already-exists';

/**
 * XP rewards are shared by all four quiz modes.
 * Rewards are based on the final number of correct answers, not per answer.
 */
export function calculateQuizXp(correctAnswers: number): number {
  if (!Number.isSafeInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > 10) {
    throw new Error('Correct answers must be an integer between 0 and 10.');
  }

  if (correctAnswers <= 2) return 5;
  if (correctAnswers <= 4) return 10;
  if (correctAnswers <= 6) return 20;
  if (correctAnswers <= 8) return 30;
  if (correctAnswers === 9) return 40;
  return 50;
}

/**
 * One level is earned for every 100 cumulative XP.
 * Level 1 therefore covers 0–99 XP.
 */
export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

/**
 * Creates a unique result ID for one quiz attempt.
 * Keep this ID for retries of the same attempt; create a new one on restart.
 */
export function createQuizResultId(uid: string): string {
  return doc(collection(db, 'users', uid, 'results')).id;
}

/**
 * Stores a completed test quiz once and awards its XP in the same transaction.
 * This client-side award is suitable for development/testing only; before
 * production, move score validation and XP awarding to trusted server code.
 */
export async function recordCompletedQuiz(
  uid: string,
  resultId: string,
  result: CompletedQuizResult,
): Promise<RecordQuizResultOutcome> {
  if (!uid.trim() || !resultId.trim()) {
    throw new Error('A user ID and result ID are required.');
  }

  const { mode, points, correctAnswers, totalQuestions } = result;

  if (
    !['player', 'club', 'career', 'stadium'].includes(mode) ||
    !Number.isSafeInteger(points) ||
    points < 0 ||
    points > 2000 ||
    !Number.isSafeInteger(correctAnswers) ||
    !Number.isSafeInteger(totalQuestions) ||
    totalQuestions !== 10 ||
    correctAnswers < 0 ||
    correctAnswers > totalQuestions
  ) {
    throw new Error('The quiz result contains invalid values.');
  }

  const resultRef = doc(db, 'users', uid, 'results', resultId);
  const profileRef = doc(db, 'users', uid);
  const xpAwarded = calculateQuizXp(correctAnswers);

  return runTransaction(db, async (transaction) => {
    const existing = await transaction.get(resultRef);
    if (existing.exists()) return 'already-exists';

    const profileSnapshot = await transaction.get(profileRef);
    if (!profileSnapshot.exists()) {
      throw new Error('The user profile is not ready yet. Please try again.');
    }

    const profile = profileSnapshot.data();
    const currentXp = typeof profile.xp === 'number' ? profile.xp : 0;
    const nextXp = currentXp + xpAwarded;

    await syncLeaderboardEntry(transaction, uid, { nickname: String(profile.nickname), nicknameKey: String(profile.nicknameKey), countryCode: typeof profile.countryCode === 'string' ? profile.countryCode : null, xp: nextXp, level: calculateLevel(nextXp) });

    transaction.set(resultRef, {
      mode,
      points,
      correctAnswers,
      totalQuestions,
      verification: 'unverified',
      completedAt: serverTimestamp(),
    });

    transaction.update(profileRef, {
      xp: nextXp,
      level: calculateLevel(nextXp),
      lastAwardedResultId: resultId,
      updatedAt: serverTimestamp(),
    });

    return 'created';
  });
}
