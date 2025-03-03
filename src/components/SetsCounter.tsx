interface SetsCounterProps {
  currentSet: number;
  totalSets: number;
  style?: React.CSSProperties;
  segmentStyle?: React.CSSProperties;
  activeSegmentStyle?: React.CSSProperties;
}

const defaultStyles = {
  container: {
    display: 'flex',
  },
  segment: {
    maxWidth: '20%',
    maxhHeight: '100%',
    height: '100%',
    width: '100px',
    backgroundColor: 'gray',

  },
  activeSegment: {
    backgroundColor: '#4CAF50'
  }
};

function SetsCounter({ 
  currentSet,
  totalSets,
  style,
  segmentStyle,
  activeSegmentStyle
}: SetsCounterProps) {
  return (
    <div style={{ ...defaultStyles.container, ...style }}>
      {Array.from({ length: totalSets }, (_, index) => (
        <div
          key={index}
          style={{
            ...defaultStyles.segment,
            ...segmentStyle,
            ...(index < currentSet ? { ...defaultStyles.activeSegment, ...activeSegmentStyle } : {}),
          }}
        />
      ))}
    </div>
  );
}

export default SetsCounter;