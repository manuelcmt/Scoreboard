import { FC, forwardRef, useImperativeHandle, useState } from 'react';

interface TeamScoreProps {
    teamSide: TeamSide;
    teamName: string;
    startingScore: number;
    startingFouls: number;
}

export interface TeamScoreHandle {
    addScore: (points: number) => void;
    addFoul: () => void;
}

export enum TeamSide { A, B }

const TeamScore: FC<TeamScoreProps> = forwardRef<TeamScoreHandle, TeamScoreProps>(({ teamName, teamSide, startingScore, startingFouls }, ref) => {
    const [score, setScore] = useState<number>(startingScore);
    const [fouls, setFouls] = useState<number>(startingFouls);

    const addScore = (points: number) => {
        setScore(currentScore => currentScore + points);
    };

    const addFoul = () => {
        setFouls(currentFouls => currentFouls + 1);
    };

    useImperativeHandle(ref, () => ({
        addScore,
        addFoul
    }));

    return (
        <div className={`team ${teamName}`} style={{ 
            display: 'flex', 
            flexDirection: teamSide === TeamSide.A ? 'row' : 'row-reverse',
            justifyContent: 'flex-start'
        }}>
            <p style={{ 
                fontSize: '2em',
                margin: '0 10px'
            }}>{score}</p>
            <p style={{ 
                margin: '0 10px'
            }}>{fouls}</p>
        </div>
    );
});

export default TeamScore;