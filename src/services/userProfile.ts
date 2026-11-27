import type { User } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp, type Transaction } from 'firebase/firestore';
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

function cleanNickname(value: string): string {
  const nickname = value.trim().normalize('NFKC').replace(/\s+/g, ' ');
  if (nickname.length < 3 || nickname.length > 24) throw new Error('nickname-invalid-length');
  if (/[\/\u0000-\u001F\u007F]/.test(nickname)) throw new Error('nickname-invalid-characters');
  return nickname;
}

function cleanCountryCode(value: string): string {
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) throw new Error('country-code-invalid');
  return code;
}

export async function ensureUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, 'users', user.uid);
  const fallbackNickname = user.displayName?.trim() || (user.isAnonymous ? 'Guest' : 'Player');

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    const existing = snapshot.exists() ? snapshot.data() : null;
    const nickname = cleanNickname(
      typeof existing?.nickname === 'string' && existing.nickname.trim()
        ? existing.nickname
        : fallbackNickname,
    );
    const nicknameKey = normalizeNickname(nickname);
    const reservationRef = doc(db, 'nicknames', nicknameKey);
    const reservation = await transaction.get(reservationRef);

    if (reservation.exists() && reservation.data().uid !== user.uid) {
      throw new Error('nickname-already-taken');
    }

    const existingCountry = typeof existing?.countryCode === 'string' ? existing.countryCode : null;
    const existingXp = typeof existing?.xp === 'number' ? existing.xp : 0;
    const existingLevel = typeof existing?.level === 'number' ? existing.level : 1;
    await syncLeaderboardEntry(transaction, user.uid, { nickname, nicknameKey, countryCode: existingCountry, xp: existingXp, level: existingLevel });
    if (snapshot.exists() && !reservation.exists()) transaction.set(reservationRef, { uid: user.uid, nickname, createdAt: serverTimestamp() });

    if (!snapshot.exists()) {
      if (!reservation.exists()) transaction.set(reservationRef, { uid: user.uid, nickname, createdAt: serverTimestamp() });
      transaction.set(profileRef, {
        nickname,
        nicknameKey,
        countryCode: null,
        identityLocked: !user.isAnonymous,
        xp: 0,
        level: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    // The profile exists here; read its data after the missing-profile branch
    // so TypeScript can safely treat it as a non-null object.
    const currentProfile = snapshot.data();
    const updates: Record<string, unknown> = {};
    if (currentProfile.nickname !== nickname) updates.nickname = nickname;
    if (currentProfile.nicknameKey !== nicknameKey) updates.nicknameKey = nicknameKey;
    if (!Object.prototype.hasOwnProperty.call(currentProfile, 'countryCode')) updates.countryCode = null;
    if (typeof currentProfile.identityLocked !== 'boolean') updates.identityLocked = !user.isAnonymous;
    else if (!user.isAnonymous && currentProfile.identityLocked === false) updates.identityLocked = true;

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      transaction.update(profileRef, updates);
    }
  });
}

/**
 * Guest identities receive a temporary nickname. During conversion, replace it
 * once with the permanent registration nickname before linking email/password.
 */
export async function prepareGuestIdentity(
  uid: string,
  nicknameInput: string,
): Promise<void> {
  const nickname = cleanNickname(nicknameInput);
  const nicknameKey = normalizeNickname(nickname);
  const profileRef = doc(db, 'users', uid);

  await runTransaction(db, async (transaction) => {
    const profileSnapshot = await transaction.get(profileRef);
    if (!profileSnapshot.exists()) throw new Error('profile-not-found');
    const profile = profileSnapshot.data();
    if (profile.identityLocked === true) throw new Error('identity-already-locked');

    const newReservationRef = doc(db, 'nicknames', nicknameKey);
    const newReservation = await transaction.get(newReservationRef);
    const oldKey = typeof profile.nicknameKey === 'string'
      ? profile.nicknameKey
      : normalizeNickname(typeof profile.nickname === 'string' ? profile.nickname : '');
    const oldReservationRef = oldKey && oldKey !== nicknameKey ? doc(db, 'nicknames', oldKey) : null;
    const oldReservation = oldReservationRef ? await transaction.get(oldReservationRef) : null;

    if (newReservation.exists() && newReservation.data().uid !== uid) {
      throw new Error('nickname-already-taken');
    }

    await syncLeaderboardEntry(transaction, uid, { nickname, nicknameKey, countryCode: typeof profile.countryCode === 'string' ? profile.countryCode : null, xp: typeof profile.xp === 'number' ? profile.xp : 0, level: typeof profile.level === 'number' ? profile.level : 1 });

    if (!newReservation.exists()) {
      transaction.set(newReservationRef, { uid, nickname, createdAt: serverTimestamp() });
    } else if (newReservation.data().nickname !== nickname) {
      transaction.update(newReservationRef, { nickname });
    }

    if (oldReservationRef && oldReservation?.exists() && oldReservation.data().uid === uid) {
      transaction.delete(oldReservationRef);
    }

    transaction.update(profileRef, {
      nickname,
      nicknameKey,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function setUserCountry(uid: string, countryCode: string): Promise<void> {
  const normalizedCountryCode = cleanCountryCode(countryCode);
  const profileRef = doc(db, 'users', uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    if (!snapshot.exists()) throw new Error('profile-not-found');

    const currentCountry = snapshot.data().countryCode;
    if (typeof currentCountry === 'string' && currentCountry.length > 0) {
      if (currentCountry === normalizedCountryCode) return;
      throw new Error('country-already-set');
    }

    await syncLeaderboardEntry(transaction, uid, { nickname: String(snapshot.data().nickname), nicknameKey: String(snapshot.data().nicknameKey), countryCode: normalizedCountryCode, xp: typeof snapshot.data().xp === 'number' ? snapshot.data().xp : 0, level: typeof snapshot.data().level === 'number' ? snapshot.data().level : 1 });
    transaction.update(profileRef, {
      countryCode: normalizedCountryCode,
      updatedAt: serverTimestamp(),
    });
  });
}


/** Keeps the public leaderboard projection in the same transaction as the private profile. */
export async function syncLeaderboardEntry(transaction: Transaction, uid: string, profile: Pick<UserProfile, 'nickname' | 'nicknameKey' | 'countryCode' | 'xp' | 'level'>): Promise<void> {
  const leaderboardRef = doc(db, 'leaderboard', uid);
  const snapshot = await transaction.get(leaderboardRef);
  const current = snapshot.exists() ? snapshot.data() : null;
  const changed = !current
    || current.nickname !== profile.nickname
    || current.nicknameKey !== profile.nicknameKey
    || current.countryCode !== profile.countryCode
    || current.xp !== profile.xp
    || current.level !== profile.level;

  if (changed) {
    transaction.set(leaderboardRef, {
      uid,
      nickname: profile.nickname,
      nicknameKey: profile.nicknameKey,
      countryCode: profile.countryCode,
      xp: profile.xp,
      level: profile.level,
      updatedAt: serverTimestamp(),
    });
  }
}
