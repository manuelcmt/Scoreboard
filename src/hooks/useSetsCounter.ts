import { useState } from 'react';

export function useSetsCounter(totalSets: number) {
  const [currentSet, setCurrentSet] = useState(1);

  return {
    currentSet,
    controls: {
      advance: () => setCurrentSet(s => s < totalSets ? s + 1 : s),
      decrement: () => setCurrentSet(s => s > 1 ? s - 1 : s),
      reset: () => setCurrentSet(1)
    }
  };
}