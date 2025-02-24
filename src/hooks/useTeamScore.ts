import { useState } from 'react';

export interface TeamScore {
  score: number;
  fouls: number;
}

export function useTeamScore(initialScore = 0, initialFouls = 0) {
  const [score, setScore] = useState(initialScore);
  const [fouls, setFouls] = useState(initialFouls);

  return {
    score,
    fouls,
    controls: {
      addPoints: (points: number) => setScore(s => s + points),
      subtractPoints: (points: number) => setScore(s => Math.max(0, s - points)),
      addFoul: () => setFouls(f => f + 1),
      removeFoul: () => setFouls(f => Math.max(0, f - 1)),
      reset: () => {
        setScore(initialScore);
        setFouls(initialFouls);
      }
    }
  };
}