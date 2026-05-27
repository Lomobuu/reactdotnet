const BASE_URL = import.meta.env.DEV
    ? 'https://localhost:7127/api'
    : '/api';

export const getProblems = async () => {
    const res = await fetch(`${BASE_URL}/problems`);
    return res.json();
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

export const deleteProblem = async (id) => {
    await fetch(`${BASE_URL}/problems/${id}`, { method: 'DELETE' });
};

export const createProblem = async (problem) => {
    const res = await fetch(`${BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problem),
    });
    return res.json();
};

export const createHold = async (hold) => {
    const res = await fetch(`${BASE_URL}/holds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hold),
    });
    return res.json();
};

export const createProblemHold = async (problemHold) => {
    await fetch(`${BASE_URL}/problemholds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemHold),
    });
};

export const getProblemHolds = async (problemId) => {
    const res = await fetch(`${BASE_URL}/problemholds/byproblem/${problemId}`);
    return res.json();
};

export const updateProblemHold = async (id, problemHold) => {
    await fetch(`${BASE_URL}/problemholds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemHold),
    });
};

export const deleteProblemHold = async (id) => {
    await fetch(`${BASE_URL}/problemholds/${id}`, { method: 'DELETE' });
};