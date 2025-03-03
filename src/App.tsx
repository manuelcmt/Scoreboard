import { useScoreBoard } from "./hooks/useScoreBoard";
import { useWebSocketControl } from "./hooks/useWebSocketControl";
import Scoreboard from "./Scoreboard";

export default function App() {
    const { state, controls } = useScoreBoard(5, 300);
    
    // Connect to WebSocket server to receive commands
    useWebSocketControl(controls);

    return (
        <>
            <Scoreboard {...state} />
        </>
    );
}