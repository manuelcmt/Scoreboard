import { useState, useEffect } from 'react';

export function useTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    
    const interval = setInterval(() => {
      setTime(current => current > 0 ? current - 1 : 0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [running]);

  return {
    time,
    controls: {
      addTime: (seconds: number) => setTime(t => t + seconds),
      pause: () => setRunning(false),
      resume: () => setRunning(true),
      reset: () => {
        setTime(initialTime);
        setRunning(true);
      },
      stop: () => {
        setRunning(false);
        setTime(0);
      }
    }
  };
}