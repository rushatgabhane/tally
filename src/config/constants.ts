export const USERS = {
  user1: { id: 'user1', email: 'rushatgabhane@gmail.com', name: 'Rushat' },
  user2: { id: 'user2', email: 'hiralgabhane@gmail.com', name: 'Hiral' },
} as const;

export const START_DATE = '2026-01-02';
export const DAILY_GOAL = 2;
export const RATINGS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900] as const;
export const PROBLEMS_PER_RATING = 31;
export const TOTAL_PROBLEMS = RATINGS.length * PROBLEMS_PER_RATING; // 372
