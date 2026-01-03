import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getUserProgress(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data().completedProblems || 0;
  }

  await setDoc(userRef, { completedProblems: 0 });
  return 0;
}

export async function markProblemComplete(
  userId: string,
  problemIndex: number
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  const current = snapshot.data()?.completedProblems || 0;

  if (problemIndex === current) {
    await updateDoc(userRef, { completedProblems: current + 1 });
  }
}

export async function markProblemIncomplete(
  userId: string,
  problemIndex: number
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  const current = snapshot.data()?.completedProblems || 0;

  if (problemIndex === current - 1) {
    await updateDoc(userRef, { completedProblems: current - 1 });
  }
}

export async function setUserProgress(
  userId: string,
  newProgress: number
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { completedProblems: newProgress });
}

export function subscribeToProgress(
  callback: (user1Progress: number, user2Progress: number) => void
): () => void {
  const user1Ref = doc(db, 'users', 'user1');
  const user2Ref = doc(db, 'users', 'user2');

  let user1Progress = 0;
  let user2Progress = 0;

  const unsub1 = onSnapshot(user1Ref, (snap) => {
    user1Progress = snap.data()?.completedProblems || 0;
    callback(user1Progress, user2Progress);
  });

  const unsub2 = onSnapshot(user2Ref, (snap) => {
    user2Progress = snap.data()?.completedProblems || 0;
    callback(user1Progress, user2Progress);
  });

  return () => {
    unsub1();
    unsub2();
  };
}
