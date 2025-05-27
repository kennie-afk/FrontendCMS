import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AppWrapper from './components/AppWrapper';
import MemberManagementRoutes from './components/MemberManagement/MemberManagementRoutes';
import EventManagementRoutes from './components/EventManagement/EventManagementRoutes';
import AnnouncementManagementRoutes from './components/AnnouncementManagement/AnnouncementManagementRoutes';
import SermonManagementRoutes from './components/SermonManagement/SermonManagementRoutes';
import FinancialManagementRoutes from './components/FinancialManagement/FinancialManagementRoutes'; 

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const navigate = useNavigate();

    const handleLogin = (newToken) => {
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        navigate('/login');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
                path="/*"
                element={
                    token ? (
                        <AppWrapper onLogout={handleLogout}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/members/*" element={<MemberManagementRoutes />} />
                                <Route path="/events/*" element={<EventManagementRoutes />} />
                                <Route path="/announcements/*" element={<AnnouncementManagementRoutes />} />
                                <Route path="/sermons/*" element={<SermonManagementRoutes />} />
                                <Route path="/financial-management/*" element={<FinancialManagementRoutes />} /> {/* Updated path for clarity */}
                            </Routes>
                        </AppWrapper>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
};

const AppRoot = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default AppRoot;