import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { USERS } from '../config/constants';

export async function login(email: string, password: string): Promise<string> {
  const validUser = Object.values(USERS).find((u) => u.email === email);
  if (!validUser) {
    throw new Error('Invalid email');
  }

  await signInWithEmailAndPassword(auth, email, password);
  return validUser.id;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(
  callback: (userId: string | null) => void
): () => void {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user = Object.values(USERS).find(
        (u) => u.email === firebaseUser.email
      );
      callback(user?.id || null);
    } else {
      callback(null);
    }
  });
}
