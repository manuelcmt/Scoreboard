interface TeamScoreProps {
    teamName: string;
    score: number;
    fouls: number;
    align: 'left' | 'right';
}

function TeamScore({ teamName, score, fouls, align }: TeamScoreProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: align == 'left' ? 'row' : 'row-reverse'
        }}>
            <div style={{fontSize: '2em'}}>{score}</div>
            <div>{fouls}</div>
        </div>
    );
}

export default TeamScore;