interface TimerProps {
    time: number;
}

const defaultStyles = {
    
}

function Timer({ time }: TimerProps) {
    return <div>{formatTime(time)}</div>;
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default Timer;