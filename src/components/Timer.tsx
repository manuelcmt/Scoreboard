interface TimerProps {
    time: number;
    style?: React.CSSProperties;
}


function Timer({ time, style }: TimerProps) {
    return <div style={style}>{formatTime(time)}</div>;
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `
        ${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}
    `;
}

export default Timer;