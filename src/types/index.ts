export interface User {
  id: string;
  email: string;
  name: string;
  completedProblems: number;
}

export interface Problem {
  globalIndex: number;
  rating: number;
  indexInRating: number;
  name: string;
}

export interface TodayTask {
  problem: Problem;
  isCompleted: boolean;
  globalIndex: number;
}
