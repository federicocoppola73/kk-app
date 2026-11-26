import type { User } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type UserProfile = {
  nickname: string;
  xp: number;
  level: number;
};

/**
 * Creates the user's Firestore profile once, preserving existing progress.
 * Authentication UID is the document ID, including for anonymous users.
 */
export async function ensureUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, 'users', user.uid);
  const nickname = user.displayName?.trim() || (user.isAnonymous ? 'Guest' : 'Player');

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);

    if (!snapshot.exists()) {
      transaction.set(profileRef, {
        nickname,
        xp: 0,
        level: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    if (snapshot.data().nickname !== nickname) {
      transaction.update(profileRef, {
        nickname,
        updatedAt: serverTimestamp(),
      });
    }
  });
}
