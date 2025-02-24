interface SetsCounterProps {
  currentSet: number;
  totalSets: number;
  style?: React.CSSProperties;
  segmentStyle?: React.CSSProperties;
}

const defaultStyles = {
  container: {
    display: 'flex',
    gap: '4px',
    padding: '8px'
  },
  segment: {
    width: '20px',
    height: '20px',
    backgroundColor: '#ddd',
    borderRadius: '50%'
  },
  activeSegment: {
    backgroundColor: '#4CAF50'
  }
};

function SetsCounter({ 
  currentSet, 
  totalSets, 
  style, 
  segmentStyle 
}: SetsCounterProps) {
  return (
    <div style={{ ...defaultStyles.container, ...style }}>
      {Array.from({ length: totalSets }, (_, index) => (
        <div
          key={index}
          style={{
            ...defaultStyles.segment,
            ...(index < currentSet && defaultStyles.activeSegment),
            ...segmentStyle
          }}
        />
      ))}
    </div>
  );
}

export default SetsCounter;