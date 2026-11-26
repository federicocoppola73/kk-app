import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type QuizMode = 'player' | 'club' | 'career' | 'stadium';

export type CompletedQuizResult = {
  mode: QuizMode;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
};

export type RecordQuizResultOutcome = 'created' | 'already-exists';

/**
 * Creates a unique result ID for one quiz attempt.
 * Keep this ID for retries of the same attempt; create a new one on restart.
 */
export function createQuizResultId(uid: string): string {
  return doc(collection(db, 'users', uid, 'results')).id;
}

/**
 * Stores a completed quiz once. Results are user-submitted and must not be
 * treated as server-verified scores or used for competitive leaderboards.
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

  return runTransaction(db, async (transaction) => {
    const existing = await transaction.get(resultRef);

    if (existing.exists()) {
      return 'already-exists';
    }

    transaction.set(resultRef, {
      mode,
      points,
      correctAnswers,
      totalQuestions,
      verification: 'unverified',
      completedAt: serverTimestamp(),
    });

    return 'created';
  });
}
