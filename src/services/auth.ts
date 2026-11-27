import {
  createUserWithEmailAndPassword,
  deleteUser,
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
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  await ensureUserProfile(credential.user);
}

export async function registerWithEmail(
  email: string,
  nickname: string,
  password: string,
  countryCode: string | null = null,
): Promise<void> {
  const normalizedEmail = email.trim();
  const normalizedNickname = nickname.trim().normalize('NFKC').replace(/\\s+/g, ' ');
  const normalizedCountry = countryCode?.trim().toUpperCase() || null;

  if (normalizedNickname.length < 3 || normalizedNickname.length > 24) {
    throw new Error('nickname-invalid-length');
  }
  if (/[\\/\\u0000-\\u001F\\u007F]/.test(normalizedNickname)) {
    throw new Error('nickname-invalid-characters');
  }
  if (normalizedCountry && !/^[A-Z]{2}$/.test(normalizedCountry)) {
    throw new Error('country-code-invalid');
  }

  const currentUser = auth.currentUser;

  // A signed-out user creates a real email/password account directly.
  // This avoids leaving an anonymous Firebase user behind when validation fails.
  if (!currentUser) {
    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    try {
      await updateProfile(credential.user, { displayName: normalizedNickname });
      await credential.user.getIdToken(true);
      // The nickname reservation and profile creation happen in one Firestore transaction.
      // If the nickname is taken, no profile/reservation is written.
      await ensureUserProfile(credential.user);
      if (normalizedCountry) {
        await setUserCountry(credential.user.uid, normalizedCountry);
      }
    } catch (error) {
      // Roll back the newly created Auth account if identity setup failed before
      // the profile was created. Never leave a half-registered Auth user behind.
      try {
        await deleteUser(credential.user);
      } catch (cleanupError) {
        console.warn('Unable to roll back incomplete account registration:', cleanupError);
      }
      throw error;
    }
    return;
  }

  if (!currentUser.isAnonymous) {
    throw new Error('account-already-registered');
  }

  // Existing guest conversion: preserve the guest UID and link credentials.
  await prepareGuestIdentity(currentUser.uid, normalizedNickname);
  const credential = EmailAuthProvider.credential(normalizedEmail, password);
  const linked = await linkWithCredential(currentUser, credential);

  await updateProfile(linked.user, { displayName: normalizedNickname });
  await linked.user.getIdToken(true);
  await ensureUserProfile(linked.user);
  if (normalizedCountry) {
    await setUserCountry(linked.user.uid, normalizedCountry);
  }
}
