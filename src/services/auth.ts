import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { ensureUserProfile, prepareGuestIdentity, setUserCountry } from './userProfile';

function makeGuestNickname() {
  return `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function continueAsGuest(): Promise<void> {
  const credential = await signInAnonymously(auth);
  await updateProfile(credential.user, { displayName: makeGuestNickname() });
  await ensureUserProfile(credential.user);
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail(
  email: string,
  nickname: string,
  password: string,
  countryCode: string | null = null,
): Promise<void> {
  const normalizedEmail = email.trim();
  const normalizedNickname = nickname.trim().normalize('NFKC').replace(/\s+/g, ' ');
  const normalizedCountry = countryCode?.trim().toUpperCase() || null;

  if (normalizedNickname.length < 3 || normalizedNickname.length > 24) {
    throw new Error('nickname-invalid-length');
  }
  if (normalizedCountry && !/^[A-Z]{2}$/.test(normalizedCountry)) {
    throw new Error('country-code-invalid');
  }

  let currentUser = auth.currentUser;
  if (!currentUser) {
    const guestCredential = await signInAnonymously(auth);
    currentUser = guestCredential.user;
    await updateProfile(currentUser, { displayName: makeGuestNickname() });
    await ensureUserProfile(currentUser);
  }

  if (!currentUser.isAnonymous) {
    throw new Error('account-already-registered');
  }

  // Claim the permanent nickname before linking credentials. A collision
  // therefore never links an email account to the wrong public identity.
  await prepareGuestIdentity(currentUser.uid, normalizedNickname);
  const credential = EmailAuthProvider.credential(normalizedEmail, password);
  const linked = await linkWithCredential(currentUser, credential);

  await updateProfile(linked.user, { displayName: normalizedNickname });
  // Refresh claims so Firestore can distinguish a linked account from a guest.
  await linked.user.getIdToken(true);
  await ensureUserProfile(linked.user);
  if (normalizedCountry) {
    await setUserCountry(linked.user.uid, normalizedCountry);
  }
}
