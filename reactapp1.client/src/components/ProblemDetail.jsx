import { useEffect, useState } from "react";
import { getProblemHolds } from "../services/api";
import BoardVisualization from "./BoardVisualization";

const roleColors = {
    Start: 'bg-green-500',
    Finish: 'bg-red-500',
    Move: 'bg-blue-500',
    Foot: 'bg-yellow-400',
};

const typeIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'plastic foothold': return '🦶';
        case 'jug':      return '✊';
        case 'crimp':    return '🤏';
        case 'sloper':   return '🖐️';
        default:         return '👋';
    }
};

export default function ProblemDetail({ problem, onHoldsLoaded }) {
    const [holds, setHolds] = useState([]);

    useEffect(() => {
        getProblemHolds(problem.id).then(data => {
            setHolds(data);
            onHoldsLoaded(data); // ← notify parent
        });
    }, [problem.id]);

    const isFoothold = (ph) => ph.hold.type?.toLowerCase() === 'plastic foothold';

    const sortedHolds = [...holds].sort((a, b) => {
        if (a.holdOrder !== b.holdOrder) return a.holdOrder - b.holdOrder;
        const aFoot = isFoothold(a);
        const bFoot = isFoothold(b);
        if (aFoot && !bFoot) return 1;
        if (!aFoot && bFoot) return -1;
        return 0;
    });

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900">{problem.name}</h2>
            <p className="text-gray-500 mb-1">Grade: {problem.grade}</p>
            <p className="text-gray-500 mb-4">{problem.description}</p>

            <div className="flex flex-col gap-2">
                {sortedHolds.map(ph => (
                    <div key={ph.id} className={`flex items-center gap-4 p-3 border rounded ${isFoothold(ph) ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
                        <span className="text-gray-400 font-mono w-8 text-center">
                            {ph.holdOrder}
                        </span>
                        <span className={`text-white text-xs px-2 py-1 rounded w-14 text-center ${isFoothold(ph) ? 'bg-yellow-400' : (roleColors[ph.role] ?? 'bg-gray-400')}`}>
                            {ph.role}
                        </span>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-gray-900">
                                {typeIcon(ph.hold.type)} {ph.hold.name}
                            </span>
                            <span className="text-sm text-gray-500">{ph.hold.type} · {ph.hold.color}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}