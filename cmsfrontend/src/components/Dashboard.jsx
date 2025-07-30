import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaBullhorn, FaMicrophoneAlt, FaCoins, FaCheckSquare, FaHome, FaBuilding } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <div className="dashboard-grid-container">
            <h2 className="dashboard-title">Admin Dashboard Overview</h2>

            <div className="dashboard-card-grid">
                <Link to="/members" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaUsers /></div>
                        <h3 className="card-title">Member Management</h3>
                        <p className="card-description">View, add, edit, and delete church members.</p>
                        <span className="card-link">Go to Members</span>
                    </div>
                </Link>

                <Link to="/events" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaCalendarAlt /></div>
                        <h3 className="card-title">Event Management</h3>
                        <p className="card-description">Organize and manage church events and activities.</p>
                        <span className="card-link">Go to Events</span>
                    </div>
                </Link>

                <Link to="/announcements" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaBullhorn /></div>
                        <h3 className="card-title">Announcement Management</h3>
                        <p className="card-description">Create and manage church announcements.</p>
                        <span className="card-link">Go to Announcements</span>
                    </div>
                </Link>

                <Link to="/sermons" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaMicrophoneAlt /></div>
                        <h3 className="card-title">Sermon Management</h3>
                        <p className="card-description">Upload and organize church sermons.</p>
                        <span className="card-link">Go to Sermons</span>
                    </div>
                </Link>

                <Link to="/financial-management/overview" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaCoins /></div>
                        <h3 className="card-title">Financial Management</h3>
                        <p className="card-description">Track tithes, offerings, and other contributions.</p>
                        <span className="card-link">Go to Finances</span>
                    </div>
                </Link>

                <Link to="/attendance" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaCheckSquare /></div>
                        <h3 className="card-title">Attendance Management</h3>
                        <p className="card-description">Record and track member attendance for services and events.</p>
                        <span className="card-link">Go to Attendance</span>
                    </div>
                </Link>

                <Link to="/families" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaHome /></div>
                        <h3 className="card-title">Family Management</h3>
                        <p className="card-description">Organize and manage church families and their members.</p>
                        <span className="card-link">Go to Families</span>
                    </div>
                </Link>

                <Link to="/departments" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaBuilding /></div>
                        <h3 className="card-title">Department Management</h3>
                        <p className="card-description">Manage church departments, their leaders, and schedules.</p>
                        <span className="card-link">Go to Departments</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
