import Timer from './components/Timer'
import { useTimer } from './hooks/useTimer'
import SetsCounter from './components/SetsCounter'
import { useSetsCounter } from './hooks/useSetsCounter'
import TeamScore from './components/TeamScore'
import { useTeamScore } from './hooks/useTeamScore'

interface ScoreboardProps {
  nSets: number;
  timeBySet: number;
}

const defaultStyles = {
  container: {
    display: 'grid',
    gridTemplateAreas: `
      "timer timer"
      "sets sets"
      "teamA teamB"
    `,
    fontFamily: 'monospace'
  }
};

function Scoreboard({ nSets, timeBySet }: ScoreboardProps) {
  const { time, controls: timerControls } = useTimer(timeBySet);
  const { currentSet, controls: setControls } = useSetsCounter(nSets);
  const teamA = useTeamScore();
  const teamB = useTeamScore();

  return (
    <div style={defaultStyles.container}>
      <span style={{gridArea: 'timer'}}><Timer time={time} /></span>
      <SetsCounter
        currentSet={currentSet}
        totalSets={nSets}
        style={{gridArea: 'sets', background: '#f0f0f0'}}
       />
      <span style={{gridArea: 'teamA'}}><TeamScore teamName="Home" score={teamA.score} fouls={teamA.fouls} align='left'/></span>
      <span style={{gridArea: 'teamB'}}><TeamScore teamName="Away" score={teamB.score} fouls={teamB.fouls} align='right' /></span>
    </div>
  );
}

export default Scoreboard;
