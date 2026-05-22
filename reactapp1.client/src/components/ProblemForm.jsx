import { useEffect, useRef, useState } from "react";
import { createProblem, createProblemHold } from "../services/api";

const GRID_SIZE = 240;
const ROLES = ['Start', 'Move', 'Finish', 'Foot'];
const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

const typeColors = {
    'jug': '#3b82f6',
    'crimp': '#ef4444',
    'sloper': '#f97316',
    'pinch': '#8b5cf6',
    'plastic foothold': '#eab308',
};

const isFoothold = (hold) => hold.type?.toLowerCase() === 'plastic foothold';

const getColor = (hold, role) => {
    if (isFoothold(hold)) return '#eab308';
    switch (role) {
        case 'Start': return '#22c55e';
        case 'Finish': return '#ef4444';
        case 'Move': return '#3b82f6';
        default: return '#9ca3af';
    }
};

const groupByHold = (problemHolds) => {
    const grouped = {};
    problemHolds.forEach(ph => {
        const key = ph.hold.id;
        if (!grouped[key]) grouped[key] = { hold: ph.hold, entries: [] };
        grouped[key].entries.push({ order: ph.holdOrder, role: ph.role });
    });
    return grouped;
};

export default function ProblemForm({ holds, onProblemCreated }) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [leftSize, setLeftSize] = useState(400);
    const [rightSize, setRightSize] = useState(400);

    useEffect(() => {
        const observeRef = (ref, setter) => {
            const observer = new ResizeObserver(entries => {
                for (const entry of entries) {
                    setter(Math.min(400, entry.contentRect.width));
                }
            });
            if (ref.current) observer.observe(ref.current);
            return observer;
        };
        const o1 = observeRef(leftRef, setLeftSize);
        const o2 = observeRef(rightRef, setRightSize);
        return () => { o1.disconnect(); o2.disconnect(); };
    }, []);

    const [problem, setProblem] = useState({ name: '', grade: '', description: '' });
    const [problemHolds, setProblemHolds] = useState([]);
    const [pendingHold, setPendingHold] = useState(null);
    const [pendingRole, setPendingRole] = useState('Start');
    const [pendingOrder, setPendingOrder] = useState(1);
    const [hovered, setHovered] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSelectHold = (hold) => {
        setPendingHold(hold);
        setPendingRole(isFoothold(hold) ? 'Foot' : 'Start');
        setPendingOrder(problemHolds.filter(ph => !isFoothold(ph.hold)).length + 1);
    };

    const handleAddHold = () => {
        if (!pendingHold) return;
        setProblemHolds(prev => [...prev, {
            hold: pendingHold,
            role: pendingRole,
            holdOrder: parseInt(pendingOrder),
        }]);
        setPendingHold(null);
    };

    const handleRemoveHold = (index) => {
        setProblemHolds(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!problem.name || !problem.grade || problemHolds.length === 0) return;
        setLoading(true);
        const created = await createProblem(problem);
        for (const ph of problemHolds) {
            await createProblemHold({
                problemId: created.id,
                holdId: ph.hold.id,
                holdOrder: ph.holdOrder,
                role: ph.role,
            });
        }
        setLoading(false);
        setSuccess(true);
        setProblem({ name: '', grade: '', description: '' });
        setProblemHolds([]);
        setPendingHold(null);
        setTimeout(() => setSuccess(false), 2000);
        if (onProblemCreated) onProblemCreated();
    };

    const canSubmit = problem.name && problem.grade && problemHolds.length > 0;

    const grouped = groupByHold(problemHolds);

    return (
        <div className="flex flex-col gap-6 w-full">

            {/* Problem details */}
            <div className="bg-white border border-gray-200 rounded p-4 flex flex-col gap-3">
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Problem Name</label>
                    <input
                        value={problem.name}
                        onChange={e => setProblem(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. The Crusher"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-sm text-gray-600 mb-1 block">Grade</label>
                        <select
                            value={problem.grade}
                            onChange={e => setProblem(p => ({ ...p, grade: e.target.value }))}
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                        >
                            <option value="">Select grade...</option>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-600 mb-1 block">Description</label>
                        <input
                            value={problem.description}
                            onChange={e => setProblem(p => ({ ...p, description: e.target.value }))}
                            placeholder="Optional notes..."
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>

            {/* Pending hold config — shown at top on mobile when a hold is selected */}
            {pendingHold && (
                <div className="bg-white border border-blue-300 rounded p-4 flex flex-col gap-3">
                    <p className="font-semibold text-gray-900">Adding: {pendingHold.name}</p>
                    <p className="text-sm text-gray-500">{pendingHold.type} · {pendingHold.color}</p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm text-gray-600 mb-1 block">Role</label>
                            <select
                                value={pendingRole}
                                onChange={e => setPendingRole(e.target.value)}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                            >
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-600 mb-1 block">Hold Order</label>
                            <input
                                type="number"
                                value={pendingOrder}
                                onChange={e => setPendingOrder(e.target.value)}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddHold}
                            style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            ✓ Add to Problem
                        </button>
                        <button
                            onClick={() => setPendingHold(null)}
                            style={{ flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Two boards — stacked on mobile, side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left board — all holds */}
                <div ref={leftRef} className="w-full lg:w-auto">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                        All Holds — tap to add to problem
                    </p>
                    <svg
                        width={leftSize}
                        height={leftSize}
                        style={{ border: '2px solid #e5e7eb', borderRadius: '8px', display: 'block' }}
                    >
                        <image
                            href="/board.png"
                            x="0"
                            y="0"
                            width={leftSize}
                            height={leftSize}
                            preserveAspectRatio="xMidYMid slice"
                        />
                        {holds.map(hold => {
                            const scale = leftSize / GRID_SIZE;
                            return (
                                <g
                                    key={hold.id}
                                    onMouseEnter={() => setHovered(hold)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => handleSelectHold(hold)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <circle
                                        cx={hold.positionX * scale}
                                        cy={hold.positionY * scale}
                                        r={pendingHold?.id === hold.id ? 14 : hovered?.id === hold.id ? 12 : 9}
                                        fill={typeColors[hold.type?.toLowerCase()] ?? '#9ca3af'}
                                        opacity={0.85}
                                        stroke={pendingHold?.id === hold.id ? 'white' : 'none'}
                                        strokeWidth={2}
                                    />
                                    <text
                                        x={hold.positionX * scale}
                                        y={hold.positionY * scale + 4}
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
                </div>

                {/* Right board — problem holds */}
                <div ref={rightRef} className="w-full lg:w-auto">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Problem Board</p>
                    <svg
                        width={rightSize}
                        height={rightSize}
                        style={{ border: '2px solid #e5e7eb', borderRadius: '8px', display: 'block' }}
                    >
                        <image
                            href="/board.png"
                            x="0"
                            y="0"
                            width={rightSize}
                            height={rightSize}
                            preserveAspectRatio="xMidYMid slice"
                        />
                        {Object.values(grouped).map(({ hold, entries }) => {
                            const scale = rightSize / GRID_SIZE;
                            const x = hold.positionX * scale;
                            const y = hold.positionY * scale;
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
                                                    r={10}
                                                    fill={getColor(hold, entry.role)}
                                                    opacity={0.85}
                                                />
                                                <text
                                                    x={x + offsetX}
                                                    y={y + 4}
                                                    textAnchor="middle"
                                                    fontSize="9"
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
            </div>

            {/* Holds in problem list */}
            {problemHolds.length > 0 && (
                <div className="bg-white border border-gray-200 rounded p-4 flex flex-col gap-2">
                    <p className="font-semibold text-gray-900 mb-1">Holds in Problem</p>
                    {problemHolds.map((ph, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                                {ph.holdOrder}. {ph.hold.name} <span className="text-gray-400">({ph.role})</span>
                            </span>
                            <button
                                onClick={() => handleRemoveHold(index)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: '16px' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Save button */}
            <button
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                style={{
                    background: canSubmit ? '#3b82f6' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
            >
                {loading ? 'Saving...' : success ? '✓ Problem Saved!' : 'Save Problem'}
            </button>
        </div>
    );
}