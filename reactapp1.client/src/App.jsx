import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHolds } from './services/api';
import ProblemList from './components/ProblemList';
import HoldForm from './components/HoldForm';
import HoldMap from './components/HoldMap';
import ProblemForm from './components/ProblemForm';

function App() {
    const location = useLocation();
    const [holds, setHolds] = useState([]);

    const fetchHolds = () => {
        getHolds().then(setHolds);
    };

    useEffect(() => {
        fetchHolds();
    }, []);

    const navLink = (path, label) => (
        <Link
            to={path}
            className={`font-semibold hover:text-blue-500 ${location.pathname === path ? 'text-blue-500' : 'text-gray-900'}`}
        >
            {label}
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6">
                {navLink('/', 'Problems')}
                {navLink('/holds', 'Holds')}
                {navLink('/add-hold', 'Add Hold')}
                {navLink('/create-problem', 'Create Problem')}
            </nav>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                <Routes>
                    <Route path="/" element={<ProblemList />} />

                    <Route path="/holds" element={
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Holds</h1>
                            <HoldMap holds={holds} onHoldsChanged={fetchHolds} />
                        </div>
                    } />

                    <Route path="/add-hold" element={
                        <div className="flex flex-col gap-10">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">Add Hold</h1>
                                <HoldForm onHoldCreated={fetchHolds} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Holds</h2>
                                <HoldMap holds={holds} onHoldsChanged={fetchHolds} />
                            </div>
                        </div>
                    } />

                    <Route path="/create-problem" element={
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Problem</h1>
                            <ProblemForm holds={holds} />
                        </div>
                    } />
                </Routes>
            </div>
        </div>
    );
}

export default App;