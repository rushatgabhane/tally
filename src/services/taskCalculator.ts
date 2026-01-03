import { DAILY_GOAL, TOTAL_PROBLEMS } from '../config/constants';
import { getDaysSinceStart } from '../utils/dateUtils';

export function calculateTodaysTasks(
  completedProblems: number,
  todayDate: string
): number[] {
  const dayNumber = getDaysSinceStart(todayDate);
  const expectedByToday = dayNumber * DAILY_GOAL;

  // Target is either expected progress or current + daily goal (if behind)
  const targetTotal = Math.max(expectedByToday, completedProblems + DAILY_GOAL);
  const cappedTotal = Math.min(targetTotal, TOTAL_PROBLEMS);

  // Return only uncompleted problems up to target
  const tasks: number[] = [];
  for (let i = completedProblems; i < cappedTotal; i++) {
    tasks.push(i);
  }

  return tasks;
}
