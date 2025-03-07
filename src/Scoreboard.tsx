import Timer from './components/Timer'
import SetsCounter from './components/SetsCounter'
import TeamScore from './components/TeamScore'
import { ScoreBoardState } from './hooks/useScoreBoard'
import './Scoreboard.css'

const defaultStyles = {
  container: {
    display: 'grid',
    width: '100%',
    height: '100%',

    gridTemplateAreas: `
      "timer timer"
      "sets sets"
      "teamA teamB"
    `,
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '3fr 1fr 3fr',

    fontFamily: 'Quantico',
    color: 'white',
  },

  timer: {
    gridArea: 'timer',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',

    fontSize: 'min(20vw, 30vh)',
    color: 'yellow',
    textShadow: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px yellow, 0 0 82px yellow, 0 0 92px yellow',
  },

  sets: {
    gridArea: 'sets',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '3vh 20vh',
    gap: '1vh',

    //backgroundColor: 'rgba(72, 37, 168, 0.5)',
  },

  setsSegment: {
    transform: 'skew(-20deg)'
  },

  teamA: {
    gridArea: 'teamA',

    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    fontSize: 'min(20vw, 30vh)',

    //backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },

  teamB: {
    gridArea: 'teamB',

    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    fontSize: 'min(20vw, 30vh)',

    //backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
};

function Scoreboard(state: ScoreBoardState) {
  return (
    <div style={defaultStyles.container}>
      <Timer
        time={state.time}
        style={defaultStyles.timer}
      />
      <SetsCounter
        currentSet={state.currentSet}
        totalSets={state.maxSets}
        style={defaultStyles.sets}
        segmentStyle={defaultStyles.setsSegment}
      />
      <TeamScore
        teamName="Home"
        score={state.teamA.score}
        fouls={state.teamA.fouls}
        align='left'
        style={defaultStyles.teamA}
      />
      <TeamScore
        teamName="Away"
        score={state.teamB.score}
        fouls={state.teamB.fouls}
        align='right'
        style={defaultStyles.teamB}
      />
    </div>
  );
}

export default Scoreboard;
