import { useEffect, useState } from "react";
import { getProblems } from "../services/api";
import ProblemDetail from "./ProblemDetail";
import BoardVisualization from "./BoardVisualization";

export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedHolds, setSelectedHolds] = useState([]);

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

    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleDelete = async (e, p) => {
        e.stopPropagation();
        if (confirmDelete === p.id) {
            await fetch(`https://localhost:7127/api/problems/${p.id}`, { method: 'DELETE' });
            setConfirmDelete(null);
            setSelected(null);
            setSelectedHolds([]);
            fetchProblems();
        } else {
            setConfirmDelete(p.id);
        }
    };



    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Boulder Problems</h1>
            <div className="flex gap-6">
                {/* Problem list */}
                <div className="flex flex-col gap-2 w-96">
                    {problems.map(p => (
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