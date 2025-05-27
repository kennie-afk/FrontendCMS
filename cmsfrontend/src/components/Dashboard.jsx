import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaBullhorn, FaMicrophoneAlt, FaCoins } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <div className="dashboard-grid-container">
            <h2 className="dashboard-title">Admin Dashboard Overview</h2>

            <div className="dashboard-card-grid">
                <div className="dashboard-section-card">
                    <div className="card-icon"><FaUsers /></div>
                    <h3 className="card-title">Member Management</h3>
                    <p className="card-description">View, add, edit, and delete church members.</p>
                    <Link to="/members" className="card-link">Go to Members</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaCalendarAlt /></div>
                    <h3 className="card-title">Event Management</h3>
                    <p className="card-description">Organize and manage church events and activities.</p>
                    <Link to="/events" className="card-link">Go to Events</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaBullhorn /></div>
                    <h3 className="card-title">Announcement Management</h3>
                    <p className="card-description">Create and manage church announcements.</p>
                    <Link to="/announcements" className="card-link">Go to Announcements</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaMicrophoneAlt /></div>
                    <h3 className="card-title">Sermon Management</h3>
                    <p className="card-description">Upload and organize church sermons.</p>
                    <Link to="/sermons" className="card-link">Go to Sermons</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaCoins /></div>
                    <h3 className="card-title">Financial Management</h3>
                    <p className="card-description">Track tithes, offerings, and other contributions.</p>
                    <Link to="/financials" className="card-link">Go to Finances</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;