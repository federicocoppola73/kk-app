import type { User } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type UserProfile = {
  nickname: string;
  nicknameKey: string;
  countryCode: string | null;
  xp: number;
  level: number;
};

export function normalizeNickname(value: string): string {
  return value.trim().normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
}

function validateNickname(value: string): string {
  const nickname = value.trim().normalize('NFKC').replace(/\s+/g, ' ');
  const key = normalizeNickname(nickname);

  if (nickname.length < 3 || nickname.length > 24) {
    throw new Error('nickname-invalid-length');
  }
  if (/[\/\u0000-\u001F\u007F]/.test(nickname)) {
    throw new Error('nickname-invalid-characters');
  }
  return key;
}

export async function ensureUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, 'users', user.uid);
  const fallbackNickname = user.displayName?.trim() || (user.isAnonymous ? 'Guest' : 'Player');

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const existing = snapshot.exists() ? snapshot.data() : null;
    // Once assigned, the Firestore nickname is the permanent public identity.
    const nickname = typeof existing?.nickname === 'string' && existing.nickname.trim()
      ? existing.nickname.trim()
      : fallbackNickname;
    const nicknameKey = validateNickname(nickname);
    const reservationRef = doc(db, 'nicknames', nicknameKey);
    const reservation = await transaction.get(reservationRef);

    if (reservation.exists() && reservation.data().uid !== user.uid) {
      throw new Error('nickname-already-taken');
    }

    if (!reservation.exists()) {
      transaction.set(reservationRef, {
        uid: user.uid,
        nickname,
        createdAt: serverTimestamp(),
      });
    }

    if (!snapshot.exists()) {
      transaction.set(profileRef, {
        nickname,
        nicknameKey,
        countryCode: null,
        xp: 0,
        level: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (existing.nicknameKey !== nicknameKey) updates.nicknameKey = nicknameKey;
    if (!Object.prototype.hasOwnProperty.call(existing, 'countryCode')) updates.countryCode = null;

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      transaction.update(profileRef, updates);
    }
  });
}

export async function setUserCountry(uid: string, countryCode: string): Promise<void> {
  const normalizedCountryCode = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalizedCountryCode)) {
    throw new Error('country-code-invalid');
  }

  const profileRef = doc(db, 'users', uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    if (!snapshot.exists()) throw new Error('profile-not-found');

    const currentCountry = snapshot.data().countryCode;
    if (typeof currentCountry === 'string' && currentCountry.length > 0) {
      throw new Error('country-already-set');
    }

    transaction.update(profileRef, {
      countryCode: normalizedCountryCode,
      updatedAt: serverTimestamp(),
    });
  });
}
