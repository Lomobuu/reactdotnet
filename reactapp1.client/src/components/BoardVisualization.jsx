export default function BoardVisualization({ holds }) {
    const SIZE = 480;
    const RADIUS = 14;
    const SCALE = 2;

    const getColor = (ph) => {
        if (ph.hold.type?.toLowerCase() === 'plastic foothold') return 'yellow';
        switch (ph.role) {
            case 'Start': return '#22c55e';
            case 'Finish': return '#ef4444';
            case 'Move': return '#3b82f6';
            default: return '#9ca3af';
        }
    };

    return (
        <div className="mb-4">
            <svg
                width={SIZE}
                height={SIZE}
                style={{ border: '2px solid #e5e7eb', borderRadius: '8px' }}
            >
                <image
                    href="/src/assets/board.jpg"
                    x="0"
                    y="0"
                    width={SIZE}
                    height={SIZE}
                    preserveAspectRatio="xMidYMid slice"
                />
                {holds.map((ph) => (
                    <g key={ph.id}>
                        <circle
                            cx={ph.hold.positionX * SCALE}
                            cy={ph.hold.positionY * SCALE}
                            r={RADIUS}
                            fill={getColor(ph)}
                            opacity={0.85}
                        />
                        <text
                            x={ph.hold.positionX * SCALE}
                            y={ph.hold.positionY * SCALE + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill="white"
                            fontWeight="bold"
                        >
                            {ph.holdOrder}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}