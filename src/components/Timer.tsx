import { FC, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface TimerProps {
    startTime: number;
}

export interface TimerHandle {
    addTime: (extraTime: number) => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    stop: () => void;
}

const Timer: FC<TimerProps> = forwardRef<TimerHandle, TimerProps>(({ startTime }, ref) => {
    const [time, setTime] = useState<number>(startTime);
    const [running, setRunning] = useState<boolean>(false);

    const update = () => {
        if (running) {
            setTime(currentTime => currentTime > 0 ? currentTime - 1 : 0);
        }
    };

    const addTime = (extraTime: number) => {
        setTime(currentTime => currentTime + extraTime);
    };

    const pause = () => {
        setRunning(false);
    }

    const resume = () => {
        setRunning(true);
    }

    const reset = () => {
        setRunning(true);
        setTime(startTime);
    }

    const stop = () => {
        setRunning(false);
        setTime(0);
    }

    const startCountDown = () => {
        const interval = (setInterval(update, 1000));
        return () => clearInterval(interval);
    };

    useEffect(startCountDown, [running]);

    useImperativeHandle(ref, () => ({
        addTime,
        pause,
        resume,
        reset,
        stop
    }));

    return <div>{fortmatTime(time)}</div>;
});

function fortmatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default Timer;