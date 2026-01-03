import { RATINGS, PROBLEMS_PER_RATING } from '../config/constants';
import { Problem } from '../types';
import { getProblem } from '../data/problems';

export function globalIndexToRating(globalIndex: number): number {
  const ratingIndex = Math.floor(globalIndex / PROBLEMS_PER_RATING);
  return RATINGS[ratingIndex] || RATINGS[RATINGS.length - 1];
}

export function globalIndexToProblem(globalIndex: number): Problem {
  const problem = getProblem(globalIndex);
  if (problem) {
    return problem;
  }

  // Fallback if problem not found
  const ratingIndex = Math.floor(globalIndex / PROBLEMS_PER_RATING);
  const indexInRating = globalIndex % PROBLEMS_PER_RATING;
  const rating = RATINGS[ratingIndex] || RATINGS[RATINGS.length - 1];

  return {
    globalIndex,
    rating,
    indexInRating,
    name: `Problem ${indexInRating + 1}`,
  };
}

export function getRatingProgress(completedProblems: number): {
  currentRating: number;
  completedInRating: number;
  totalInRating: number;
} {
  const ratingIndex = Math.floor(completedProblems / PROBLEMS_PER_RATING);
  const completedInRating = completedProblems % PROBLEMS_PER_RATING;

  return {
    currentRating: RATINGS[Math.min(ratingIndex, RATINGS.length - 1)],
    completedInRating,
    totalInRating: PROBLEMS_PER_RATING,
  };
}
