import { FC, forwardRef, useImperativeHandle, useState } from 'react';
import './SetsCounter.css';

interface SetsCounterProps {
    nSets: number;
}

export interface SetsCounterHandle {
    advanceSet: () => void;
    decrementSet: () => void;
}

const SetsCounter: FC<SetsCounterProps> = forwardRef<SetsCounterHandle, SetsCounterProps>(({ nSets }, ref) => {
    const [currentSet, setCurrentSet] = useState<number>(1);

    const advanceSet = () => {
        setCurrentSet(currentSet => currentSet < nSets ? currentSet + 1 : nSets);
    };

    const decrementSet = () => {
        setCurrentSet(currentSet => currentSet > 1 ? currentSet - 1 : 1);
    };

    useImperativeHandle(ref, () => ({
        advanceSet,
        decrementSet
    }));

    return (
        <div>
            <div className="progress-bar">
                {Array.from({ length: nSets }, (_, index) => (
                    <div
                        key={index}
                        className={`progress-segment ${index < currentSet ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
});

export default SetsCounter;