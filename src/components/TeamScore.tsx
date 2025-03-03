interface TeamScoreProps {
    teamName: string;
    score: number;
    fouls: number;
    align: 'left' | 'right';
    style?: React.CSSProperties;
}

function TeamScore({ teamName, score, fouls, align, style }: TeamScoreProps) {
    return (
        <div style={{
            display: 'flex',

            ...style,

            flexDirection: align == 'left' ? 'row' : 'row-reverse'
        }}>
            <div 
                style={{
                    fontSize: style?.fontSize,
                }}
            >{score < 10 ? '0' : ''}{score}</div>

            <b
                style={{
                    fontSize: `calc(${style?.fontSize} / 1.5)`,
                }}
            >{fouls}</b>
        </div>
    );
}

export default TeamScore;