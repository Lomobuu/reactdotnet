const BASE_URL = 'https://localhost:7127/api';

export const getProblems = async () => {
    const res = await fetch(`${BASE_URL}/problems`);
    return res.json();
};

export const getProblemHolds = async (problemId) => {
    const res = await fetch(`${BASE_URL}/problemholds/byproblem/${problemId}`);
    return res.json();
};

export const deleteProblem = async (id) => {
    await fetch(`${BASE_URL}/problems/${id}`, { method: 'DELETE' });
};

export const getHolds = async () => {
    const res = await fetch(`${BASE_URL}/holds`);
    return res.json();
};

export const deleteHold = async (id) => {
    await fetch(`${BASE_URL}/holds/${id}`, { method: 'DELETE' });
};

export const updateHold = async (id, hold) => {
    await fetch(`${BASE_URL}/holds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hold),
    });
};