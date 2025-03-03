import { useEffect } from 'react';
import { ScoreBoardControls } from './useScoreBoard';

// Command types for our WebSocket messages
export type WebSocketCommand = 
  | { type: 'timer', action: 'pause' | 'resume' | 'reset' | 'stop' }
  | { type: 'sets', action: 'advance' | 'decrement' | 'reset' }
  | { type: 'team', team: 'A' | 'B', action: 'addPoints' | 'subtractPoints' | 'addFoul' | 'removeFoul', value?: number };

export function useWebSocketControl(controls: ScoreBoardControls, url: string = 'ws://localhost:8080') {
  useEffect(() => {
    console.log('Creating WebSocket connection');
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const command = JSON.parse(event.data) as WebSocketCommand;
        
        switch (command.type) {
          case 'timer':
            switch (command.action) {
              case 'pause': controls.timerControls.pause(); break;
              case 'resume': controls.timerControls.resume(); break;
              case 'reset': controls.timerControls.reset(); break;
              case 'stop': controls.timerControls.stop(); break;
            }
            break;
            
          case 'sets':
            switch (command.action) {
              case 'advance': controls.setControls.advance(); break;
              case 'decrement': controls.setControls.decrement(); break;
              case 'reset': controls.setControls.reset(); break;
            }
            break;
            
          case 'team':
            const teamControls = command.team === 'A' ? controls.teamAControls : controls.teamBControls;
            switch (command.action) {
              case 'addPoints': teamControls.addPoints(command.value || 1); break;
              case 'subtractPoints': teamControls.subtractPoints(command.value || 1); break;
              case 'addFoul': teamControls.addFoul(); break;
              case 'removeFoul': teamControls.removeFoul(); break;
            }
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);
}