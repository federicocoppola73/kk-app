import type { User } from 'firebase/auth';
import {
  doc,
  runTransaction,
  serverTimestamp,
  type DocumentReference,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export type UserProfile = {
  nickname: string;
  nicknameKey: string;
  countryCode: string | null;
  xp: number;
  level: number;
};

export function normalizeNickname(value: string): string {
  return value.trim().normalize('NFKC').toLowerCase().replace(/\\s+/g, ' ');
}

function validateNickname(value: string): string {
  const nickname = value.trim().normalize('NFKC').replace(/\\s+/g, ' ');
  const key = normalizeNickname(nickname);

  if (nickname.length < 3 || nickname.length > 24) {
    throw new Error('nickname-invalid-length');
  }
  if (/[\\/\\u0000-\\u001F\\u007F]/.test(nickname)) {
    throw new Error('nickname-invalid-characters');
  }
  return key;
}

function nicknameRef(nicknameKey: string) {
  return doc(db, 'nicknames', nicknameKey);
}

export async function ensureUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, 'users', user.uid);
  const fallbackNickname = user.displayName?.trim() || (user.isAnonymous ? 'Guest' : 'Player');

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const existing = snapshot.exists() ? snapshot.data() : null;
    const nickname = typeof existing?.nickname === 'string' && existing.nickname.trim()
      ? existing.nickname.trim()
      : fallbackNickname;
    const nicknameKey = validateNickname(nickname);
    const oldNicknameKey = typeof existing?.nicknameKey === 'string'
      ? existing.nicknameKey
      : null;

    const reservationRef = nicknameRef(nicknameKey);
    const reservation = await transaction.get(reservationRef);
    let oldReservationRef: DocumentReference | null = null;
    let oldReservation: DocumentSnapshot | null = null;

    if (oldNicknameKey && oldNicknameKey !== nicknameKey) {
      oldReservationRef = nicknameRef(oldNicknameKey);
      oldReservation = await transaction.get(oldReservationRef);
    }

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

    const profileData = snapshot.data();
    const updates: Record<string, unknown> = {};
    if (profileData.nicknameKey !== nicknameKey) updates.nicknameKey = nicknameKey;
    if (!Object.prototype.hasOwnProperty.call(profileData, 'countryCode')) updates.countryCode = null;

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      transaction.update(profileRef, updates);
    }

    if (oldReservationRef && oldReservation?.exists() && oldReservation.data().uid === user.uid) {
      transaction.delete(oldReservationRef);
    }
  });
}

export async function updateUserIdentity(
  uid: string,
  nicknameInput: string,
  countryCode: string | null,
): Promise<void> {
  const nickname = nicknameInput.trim().normalize('NFKC').replace(/\\s+/g, ' ');
  const nicknameKey = validateNickname(nickname);
  const normalizedCountryCode = countryCode ? countryCode.trim().toUpperCase() : null;

  if (normalizedCountryCode !== null && !/^[A-Z]{2}$/.test(normalizedCountryCode)) {
    throw new Error('country-code-invalid');
  }

  const profileRef = doc(db, 'users', uid);

  await runTransaction(db, async (transaction) => {
    const profileSnapshot = await transaction.get(profileRef);
    if (!profileSnapshot.exists()) throw new Error('profile-not-found');

    const profile = profileSnapshot.data();
    const oldNicknameKey = typeof profile.nicknameKey === 'string'
      ? profile.nicknameKey
      : normalizeNickname(typeof profile.nickname === 'string' ? profile.nickname : '');

    const newReservationRef = nicknameRef(nicknameKey);
    const newReservation = await transaction.get(newReservationRef);
    let oldReservationRef: DocumentReference | null = null;
    let oldReservation: DocumentSnapshot | null = null;

    if (oldNicknameKey && oldNicknameKey !== nicknameKey) {
      oldReservationRef = nicknameRef(oldNicknameKey);
      oldReservation = await transaction.get(oldReservationRef);
    }

    if (newReservation.exists() && newReservation.data().uid !== uid) {
      throw new Error('nickname-already-taken');
    }

    if (!newReservation.exists()) {
      transaction.set(newReservationRef, {
        uid,
        nickname,
        createdAt: serverTimestamp(),
      });
    } else if (newReservation.data().nickname !== nickname) {
      transaction.update(newReservationRef, { nickname });
    }

    if (oldReservationRef && oldReservation?.exists() && oldReservation.data().uid === uid) {
      transaction.delete(oldReservationRef);
    }

    transaction.update(profileRef, {
      nickname,
      nicknameKey,
      countryCode: normalizedCountryCode,
      updatedAt: serverTimestamp(),
    });
  });
}
