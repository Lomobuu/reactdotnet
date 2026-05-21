import { useEffect, useState } from "react";
import ProblemDetail from "./ProblemDetail";
import BoardVisualization from "./BoardVisualization";
import { getProblems, deleteProblem } from "../services/api";

const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

const gradeOrder = (grade) => {
    const index = GRADES.indexOf(grade);
    return index === -1 ? 999 : index;
};

export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedHolds, setSelectedHolds] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [filterGrade, setFilterGrade] = useState('');
    const [filterName, setFilterName] = useState('');
    const [sortDir, setSortDir] = useState('asc'); // asc = V0 first, desc = V10 first

    const fetchProblems = () => {
        getProblems().then(setProblems);
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleClick = (p) => {
        setSelected(prev => prev?.id === p.id ? null : p);
        setSelectedHolds([]);
    };

    const handleDelete = async (e, p) => {
        e.stopPropagation();
        if (confirmDelete === p.id) {
            await deleteProblem(p.id);
            setConfirmDelete(null);
            setSelected(null);
            setSelectedHolds([]);
            fetchProblems();
        } else {
            setConfirmDelete(p.id);
        }
    };

    const filtered = problems
        .filter(p => {
            const matchGrade = filterGrade === '' || p.grade === filterGrade;
            const matchName = filterName === '' || p.name.toLowerCase().includes(filterName.toLowerCase());
            return matchGrade && matchName;
        })
        .sort((a, b) => {
            const diff = gradeOrder(a.grade) - gradeOrder(b.grade);
            return sortDir === 'asc' ? diff : -diff;
        });

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Boulder Problems</h1>

            {/* Filters and sort */}
            <div className="flex gap-3 mb-4 items-center flex-wrap">
                <input
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                    placeholder="Search by name..."
                    className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400 w-48"
                />
                <select
                    value={filterGrade}
                    onChange={e => setFilterGrade(e.target.value)}
                    className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                >
                    <option value="">All grades</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                {/* Sort toggle */}
                <button
                    onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                    style={{ background: '#e5e7eb', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}
                >
                    Grade {sortDir === 'asc' ? 'V0 → V10 ↑' : 'V10 → V0 ↓'}
                </button>

                {(filterGrade || filterName) && (
                    <button
                        onClick={() => { setFilterGrade(''); setFilterName(''); }}
                        style={{ background: '#e5e7eb', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <div className="flex gap-6">
                {/* Problem list */}
                <div className="flex flex-col gap-2 w-96">
                    {filtered.length === 0 && (
                        <p className="text-gray-400 text-sm">No problems match your filters.</p>
                    )}
                    {filtered.map(p => (
                        <div key={p.id} className="border border-gray-200 rounded bg-white">
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleClick(p)}
                                    className="flex-1 text-left p-3 flex justify-between items-center hover:bg-gray-50"
                                >
                                    <div>
                                        <span className="font-semibold text-gray-900">{p.name}</span>
                                        <span className="ml-3 text-sm text-gray-500">{p.grade}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {selected?.id === p.id ? '▲' : '▼'}
                                    </span>
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, p)}
                                    onBlur={() => setConfirmDelete(null)}
                                    title={confirmDelete === p.id ? 'Click again to confirm' : 'Delete problem'}
                                    style={{
                                        background: confirmDelete === p.id ? '#ef4444' : 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0 12px',
                                        color: confirmDelete === p.id ? 'white' : '#ef4444',
                                        fontSize: '18px',
                                        borderRadius: '4px',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>

                            {selected?.id === p.id && (
                                <div className="border-t border-gray-200 p-3">
                                    <ProblemDetail problem={p} onHoldsLoaded={setSelectedHolds} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Board */}
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2 font-semibold">
                        {selected ? selected.name : 'No problem selected'}
                    </p>
                    <BoardVisualization holds={selectedHolds} />
                </div>
            </div>
        </div>
    );
}