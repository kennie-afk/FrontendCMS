import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaBullhorn, FaMicrophoneAlt, FaCoins, FaSignOutAlt } from 'react-icons/fa';

const AppWrapper = ({ children, onLogout }) => {
    return (
        <div className="app-wrapper">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>Church CRM</h1>
                    <p>Admin Panel</p>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                                <FaHome /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/members" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaUsers /> Member Management
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaCalendarAlt /> Event Management
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/announcements" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaBullhorn /> Announcement Management
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/sermons" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaMicrophoneAlt /> Sermon Management
                            </NavLink>
                        </li>
                        <li>
                        <NavLink to="/financial-management" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaCoins /> Financial Management
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={onLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default AppWrapper;