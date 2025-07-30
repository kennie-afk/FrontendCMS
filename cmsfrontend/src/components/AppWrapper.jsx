import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaBullhorn, FaMicrophoneAlt, FaCoins, FaSignOutAlt, FaCaretDown, FaCaretUp, FaCheckSquare, FaBuilding } from 'react-icons/fa';

const AppWrapper = ({ children, onLogout }) => {
    const [showFinancialSubMenu, setShowFinancialSubMenu] = useState(false);

    const toggleFinancialSubMenu = () => {
        setShowFinancialSubMenu(prevState => !prevState);
    };

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
                            <NavLink to="/families" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaUsers /> Family Management
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/departments" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaBuilding /> Department Management
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
                            <NavLink to="/attendance" className={({ isActive }) => isActive ? "active" : ""}>
                                <FaCheckSquare /> Attendance
                            </NavLink>
                        </li>
                        <li className="sidebar-dropdown">
                            <div className="dropdown-header" onClick={toggleFinancialSubMenu}>
                                <FaCoins /> Financial Management
                                {showFinancialSubMenu ? <FaCaretUp className="dropdown-icon" /> : <FaCaretDown className="dropdown-icon" />}
                            </div>
                            {showFinancialSubMenu && (
                                <ul className="sidebar-submenu">
                                    <li>
                                        <NavLink to="/financial-management/overview" className={({ isActive }) => isActive ? "active" : ""}>
                                            Financial Overview
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/financial-management/member-contributions" className={({ isActive }) => isActive ? "active" : ""}>
                                            Member Contributions (Individual)
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/financial-management/all-member-contributions" className={({ isActive }) => isActive ? "active" : ""}>
                                            All Member Contributions
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button onClick={onLogout} className="logout-btn">
                                <FaSignOutAlt /> Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default AppWrapper;
