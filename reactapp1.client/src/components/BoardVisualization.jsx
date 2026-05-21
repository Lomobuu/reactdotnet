export default function BoardVisualization({ holds }) {
    const SIZE = 480;
    const RADIUS = 14;
    const SCALE = 2;

    const getColor = (hold, role) => {
        if (hold.type?.toLowerCase() === 'plastic foothold') return 'yellow';
        switch (role) {
            case 'Start': return '#22c55e';
            case 'Finish': return '#ef4444';
            case 'Move': return '#3b82f6';
            default: return '#9ca3af';
        }
    };

    const grouped = {};
    holds.forEach(ph => {
        const key = ph.hold?.id;
        if (!grouped[key]) grouped[key] = { hold: ph.hold, entries: [] };
        grouped[key].entries.push({ order: ph.holdOrder, role: ph.role });
    });

    return (
        <div className="mb-4">
            <svg
                width={SIZE}
                height={SIZE}
                style={{ border: '2px solid #e5e7eb', borderRadius: '8px' }}
            >
                <image
                    href="/board.png"
                    x="0"
                    y="0"
                    width={SIZE}
                    height={SIZE}
                    preserveAspectRatio="xMidYMid slice"
                />
                {Object.values(grouped).map(({ hold, entries }) => {
                    const x = hold.positionX * SCALE;
                    const y = hold.positionY * SCALE;
                    const total = entries.length;
                    const sorted = [...entries].sort((a, b) => a.order - b.order);

                    return (
                        <g key={hold.id}>
                            {sorted.map((entry, i) => {
                                const offsetX = total > 1 ? (i - (total - 1) / 2) * 18 : 0;
                                return (
                                    <g key={entry.order}>
                                        <circle
                                            cx={x + offsetX}
                                            cy={y}
                                            r={RADIUS}
                                            fill={getColor(hold, entry.role)}
                                            opacity={0.85}
                                        />
                                        <text
                                            x={x + offsetX}
                                            y={y + 4}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill="white"
                                            fontWeight="bold"
                                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                                        >
                                            {entry.order}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}