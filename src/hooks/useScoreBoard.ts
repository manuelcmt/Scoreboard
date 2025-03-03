import { useSetsCounter } from "./useSetsCounter";
import { useTimer } from "./useTimer";
import { useTeamScore } from "./useTeamScore";

interface TeamState {
    score: number;
    fouls: number;
}
export interface ScoreBoardState {
    time: number;
    currentSet: number;
    maxSets: number;
    teamA: TeamState;
    teamB: TeamState;
}

export interface ScoreBoardControls {
    timerControls: ReturnType<typeof useTimer>['controls'];
    setControls: ReturnType<typeof useSetsCounter>['controls'];
    teamAControls: ReturnType<typeof useTeamScore>['controls'];
    teamBControls: ReturnType<typeof useTeamScore>['controls'];
}

export function useScoreBoard(nSets: number, timeBySet: number) {
    const { time, controls: timerControls } = useTimer(timeBySet);
    const { currentSet, controls: setControls } = useSetsCounter(nSets);
    const { score: teamAScore, fouls: teamAFouls, controls: teamAControls } = useTeamScore();
    const { score: teamBScore, fouls: teamBFouls, controls: teamBControls } = useTeamScore();

    return {
        state: {
            time,
            currentSet,
            maxSets: nSets,
            teamA: { score: teamAScore, fouls: teamAFouls },
            teamB: { score: teamBScore, fouls: teamBFouls }
        } as ScoreBoardState,

        controls: {
            timerControls,
            setControls,
            teamAControls,
            teamBControls,
        } as ScoreBoardControls,
    };
}