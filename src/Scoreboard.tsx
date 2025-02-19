import './Scoreboard.css'
import { FC, useRef } from 'react'
import Timer, { TimerHandle } from './components/Timer'
import SetsCounter, { SetsCounterHandle } from './components/SetsCounter'
import TeamScore, { TeamScoreHandle, TeamSide } from './components/TeamScore'

interface ScoreboardProps {
  nSets: number;
  timeBySet: number;
}

const Scoreboard: FC<ScoreboardProps> = ({ nSets, timeBySet }) => {
  const timerRef = useRef<TimerHandle>(null);
  const setsCounterRef = useRef<SetsCounterHandle>(null);

  const addTime = () => {
    timerRef.current?.addTime(10);
  };

  const pauseTimer = () => {
    timerRef.current?.pause();
  };

  const resumeTimer = () => {
    timerRef.current?.resume();
  };

  const resetTimer = () => {
    timerRef.current?.reset();
  };

  const stopTimer = () => {
    timerRef.current?.stop();
  };

  const advanceSet = () => {
    setsCounterRef.current?.advanceSet();
  };

  const decrementSet = () => {
    setsCounterRef.current?.decrementSet();
  }

  return (
    <div className="scoreboard">
      <div className='timer'>
        <Timer ref={timerRef} startTime={timeBySet} />
      </div>
      <div className='sets-counter'>
        <SetsCounter ref={setsCounterRef} nSets={nSets}></SetsCounter>
      </div>
      <div className='team1'>
        <TeamScore teamName='Home' teamSide={TeamSide.A} startingScore={0} startingFouls={0} />
      </div>
      <div className='team2'>
        <TeamScore teamName='Away' teamSide={TeamSide.B} startingScore={0} startingFouls={0} />
      </div>
      <button onClick={decrementSet}>Previous Set</button>
      <button onClick={advanceSet}>Next Set</button>
      <button onClick={addTime}>Add 10 seconds</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resumeTimer}>Resume</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
};

export default Scoreboard;
