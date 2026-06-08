import { useState, useRef } from "react";
import { deleteHold, updateHold } from "../services/api";

const GRID_SIZE = 240;
const DISPLAY_SIZE = 480;
const SCALE = DISPLAY_SIZE / GRID_SIZE;

const typeColors = {
    'jug': '#3b82f6',
    'crimp': '#ef4444',
    'sloper': '#f97316',
    'pinch': '#8b5cf6',
    'plastic foothold': '#eab308',
};

const typeIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'plastic foothold': return '🦶';
        case 'jug': return '✊';
        case 'crimp': return '🤏';
        case 'sloper': return '🖐️';
        case 'pinch': return '🤙';
        default: return '👋';
    }
};
export default function HoldMap({ holds, onHoldsChanged, onHoldClick, highlightedIds = [] }) {
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);
    const [dragging, setDragging] = useState(null);
    const svgRef = useRef(null);

    const getSVGCoords = (e) => {
        const rect = svgRef.current.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) / SCALE);
        const y = Math.round((e.clientY - rect.top) / SCALE);
        return {
            x: Math.max(0, Math.min(GRID_SIZE, x)),
            y: Math.max(0, Math.min(GRID_SIZE, y))
        };
    };

    const handleMouseDown = (e, hold) => {
        e.preventDefault();
        if (onHoldClick) return;
        setSelected(hold);
        setDragging({ hold, x: hold.positionX, y: hold.positionY });
    };

    const handleClick = (hold) => {
        if (onHoldClick) {
            onHoldClick(hold);
            return;
        }
        setSelected(prev => prev?.id === hold.id ? null : hold);
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const { x, y } = getSVGCoords(e);
        setDragging(prev => ({ ...prev, x, y }));
    };

    const handleMouseUp = async (e) => {
        if (!dragging) return;
        const { x, y } = getSVGCoords(e);
        const updated = { ...dragging.hold, positionX: x, positionY: y };
        await updateHold(updated.id, updated);
        setSelected(updated);
        setDragging(null);
        onHoldsChanged();
    };

    const handleDelete = async () => {
        if (!selected) return;
        await deleteHold(selected.id);
        setSelected(null);
        onHoldsChanged();
    };

    const getPos = (hold) => {
        if (dragging?.hold.id === hold.id) return { x: dragging.x, y: dragging.y };
        return { x: hold.positionX, y: hold.positionY };
    };

    const pickerMode = !!onHoldClick;

    return (
        <div className="flex gap-8">
            <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                    {pickerMode ? 'Click a hold to add to problem' : dragging ? '🖱️ Drag to reposition' : 'All Holds — drag to move'}
                </p>
                <svg
                    ref={svgRef}
                    width={DISPLAY_SIZE}
                    height={DISPLAY_SIZE}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => { if (dragging) setDragging(null); }}
                    style={{ border: '2px solid #e5e7eb', borderRadius: '8px', cursor: dragging ? 'grabbing' : 'default' }}
                >
                    <image
                        href="/board.jpg"
                        x="0"
                        y="0"
                        width={DISPLAY_SIZE}
                        height={DISPLAY_SIZE}
                        preserveAspectRatio="xMidYMid slice"
                    />
                    {holds.map(hold => {
                        const { x, y } = getPos(hold);
                        const isSelected = selected?.id === hold.id;
                        const isDragging = dragging?.hold.id === hold.id;
                        const isHighlighted = highlightedIds.includes(hold.id);

                        return (
                            <g
                                key={hold.id}
                                onMouseEnter={() => !dragging && setHovered(hold)}
                                onMouseLeave={() => setHovered(null)}
                                onMouseDown={(e) => handleMouseDown(e, hold)}
                                onClick={() => handleClick(hold)}
                                style={{ cursor: pickerMode ? 'pointer' : 'grab' }}
                            >
                                <circle
                                    cx={x * SCALE}
                                    cy={y * SCALE}
                                    r={isDragging ? 18 : isSelected || isHighlighted ? 16 : hovered?.id === hold.id ? 14 : 10}
                                    fill={typeColors[hold.type?.toLowerCase()] ?? '#9ca3af'}
                                    opacity={isDragging ? 0.6 : 0.85}
                                    stroke={isSelected || isHighlighted ? 'white' : 'none'}
                                    strokeWidth={2}
                                />
                                <text
                                    x={x * SCALE}
                                    y={y * SCALE + 4}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="white"
                                    fontWeight="bold"
                                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                                >
                                    {hold.id}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div className="flex gap-4 mt-3 flex-wrap">
                    {Object.entries(typeColors).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-1 text-xs text-gray-600">
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                            {type}
                        </div>
                    ))}
                </div>
            </div>

            {!pickerMode && (
                <div className="w-64">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Hold Details</p>
                    {selected ? (
                        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col gap-3">
                            <div className="text-lg">{typeIcon(selected.type)} <span className="font-bold text-gray-900">{selected.name}</span></div>
                            <div className="text-sm text-gray-500">Type: {selected.type}</div>
                            <div className="text-sm text-gray-500">Color: {selected.color}</div>
                            <div className="text-sm text-gray-400 font-mono">
                                X: {dragging?.hold.id === selected.id ? dragging.x : selected.positionX}{' '}
                                Y: {dragging?.hold.id === selected.id ? dragging.y : selected.positionY}
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <button
                                    onClick={handleDelete}
                                    style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    🗑️ Delete Hold
                                </button>
                                <button
                                    onClick={() => setSelected(null)}
                                    style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Deselect
                                </button>
                            </div>
                        </div>
                    ) : hovered ? (
                        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col gap-2">
                            <div className="text-lg">{typeIcon(hovered.type)} <span className="font-bold text-gray-900">{hovered.name}</span></div>
                            <div className="text-sm text-gray-500">Type: {hovered.type}</div>
                            <div className="text-sm text-gray-500">Color: {hovered.color}</div>
                            <div className="text-sm text-gray-400 font-mono">X: {hovered.positionX} Y: {hovered.positionY}</div>
                            <p className="text-xs text-gray-400 mt-1">Click to select</p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Hover to preview, drag to move, click to select</p>
                    )}
                </div>
            )}
        </div>
    );
}