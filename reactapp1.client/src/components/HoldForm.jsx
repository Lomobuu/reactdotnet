import { useState } from "react";
import { createHold } from "../services/api";

const HOLD_TYPES = ['Jug', 'Crimp', 'Sloper', 'Pinch', 'Plastic Foothold'];
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black', 'Orange', 'Purple', 'Light', 'Brown'];

const GRID_SIZE = 240;
const DISPLAY_SIZE = 480;
const SCALE = DISPLAY_SIZE / GRID_SIZE;

export default function HoldForm({ onHoldCreated }) {
    const [form, setForm] = useState({
        name: '',
        type: '',
        color: '',
        position: '',
        positionX: null,
        positionY: null,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBoardClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) / SCALE);
        const y = Math.round((e.clientY - rect.top) / SCALE);
        setForm(prev => ({
            ...prev,
            positionX: Math.max(0, Math.min(GRID_SIZE, x)),
            positionY: Math.max(0, Math.min(GRID_SIZE, y)),
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        await createHold(form)({
                ...form,
                positionX: parseFloat(form.positionX),
                positionY: parseFloat(form.positionY),
            }),
        setLoading(false);
        setSuccess(true);
        setForm({ name: '', type: '', color: '', position: '', positionX: null, positionY: null });
        setTimeout(() => setSuccess(false), 2000);
        if (onHoldCreated) onHoldCreated();
    };

    const canSubmit = form.name && form.type && form.color && form.positionX !== null;

    return (
        <div className="flex gap-8">
            {/* Board */}
            <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Click to place hold</p>
                <svg
                    width={DISPLAY_SIZE}
                    height={DISPLAY_SIZE}
                    onClick={handleBoardClick}
                    style={{ border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'crosshair' }}
                >
                    <image
                        href="/src/assets/board.png"
                        x="0"
                        y="0"
                        width={DISPLAY_SIZE}
                        height={DISPLAY_SIZE}
                        preserveAspectRatio="xMidYMid slice"
                    />
                    {form.positionX !== null && (
                        <circle
                            cx={form.positionX * SCALE}
                            cy={form.positionY * SCALE}
                            r={10}
                            fill="#3b82f6"
                            opacity={0.85}
                            style={{ pointerEvents: 'none' }}
                        />
                    )}
                </svg>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-200 rounded p-6 w-80 flex flex-col gap-3 h-fit">
                <h2 className="text-xl font-bold text-gray-900">Add Hold</h2>

                {/* Selected position */}
                <div className="text-sm text-gray-500">
                    {form.positionX !== null
                        ? `Position: (${form.positionX}, ${form.positionY})`
                        : 'No position selected — click the board'}
                </div>

                {/* Name */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Left crimp"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                    >
                        <option value="">Select type...</option>
                        {HOLD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Color */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Color</label>
                    <select
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                    >
                        <option value="">Select color...</option>
                        {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Position description */}
                <div>
                    <label className="text-sm text-gray-600 mb-1 block">Position Description</label>
                    <input
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="e.g. Bottom middle"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-400"
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit}
                    style={{
                        marginTop: '8px',
                        background: canSubmit ? '#3b82f6' : '#9ca3af',
                        color: 'white',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        border: 'none',
                    }}
                >
                    {loading ? 'Saving...' : success ? '✓ Saved!' : 'Add Hold'}
                </button>
            </div>
        </div>
    );
}
