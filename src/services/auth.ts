import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

function makeGuestNickname() {
  return `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function continueAsGuest(): Promise<void> {
  const credential = await signInAnonymously(auth);
  await updateProfile(credential.user, { displayName: makeGuestNickname() });
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerWithEmail(email: string, nickname: string, password: string): Promise<void> {
  const normalizedEmail = email.trim();
  const normalizedNickname = nickname.trim();
  const currentUser = auth.currentUser;

  if (currentUser?.isAnonymous) {
    const credential = EmailAuthProvider.credential(normalizedEmail, password);
    const linked = await linkWithCredential(currentUser, credential);
    await updateProfile(linked.user, { displayName: normalizedNickname });
    return;
  }

  const created = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  await updateProfile(created.user, { displayName: normalizedNickname });
}
