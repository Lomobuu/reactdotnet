import { useEffect, useRef, useState } from "react";

export default function BoardVisualization({ holds }) {
    const containerRef = useRef(null);
    const [size, setSize] = useState(480);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setSize(Math.min(480, width));
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const RADIUS = 14 * (size / 480);
    const SCALE = size / 240;

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
        <div ref={containerRef} className="w-full mb-4">
            <svg
                width={size}
                height={size}
                style={{ border: '2px solid #e5e7eb', borderRadius: '8px', display: 'block' }}
            >
                <image
                    href="/board.jpg"
                    x="0"
                    y="0"
                    width={size}
                    height={size}
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
                                const offsetX = total > 1 ? (i - (total - 1) / 2) * (RADIUS * 1.4) : 0;
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
                                            y={y + RADIUS * 0.3}
                                            textAnchor="middle"
                                            fontSize={RADIUS * 0.8}
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