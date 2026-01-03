import { useState, useEffect } from 'react';
import { subscribeToProgress } from '../services/progressService';
import { calculateTodaysTasks } from '../services/taskCalculator';
import { globalIndexToProblem } from '../utils/problemUtils';
import { getTodayDateString } from '../utils/dateUtils';
import { TodayTask } from '../types';

export function useTodayTasks(userId: string | null) {
  const [myTasks, setMyTasks] = useState<TodayTask[]>([]);
  const [myProgress, setMyProgress] = useState(0);
  const [partnerProgress, setPartnerProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const today = getTodayDateString();
    const isUser1 = userId === 'user1';

    const unsubscribe = subscribeToProgress((user1Prog, user2Prog) => {
      const myProg = isUser1 ? user1Prog : user2Prog;
      const partProg = isUser1 ? user2Prog : user1Prog;

      setMyProgress(myProg);
      setPartnerProgress(partProg);

      const myTaskIndices = calculateTodaysTasks(myProg, today);

      setMyTasks(
        myTaskIndices.map((idx) => ({
          problem: globalIndexToProblem(idx),
          isCompleted: false,
          globalIndex: idx,
        }))
      );

      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { myTasks, myProgress, partnerProgress, loading };
}
