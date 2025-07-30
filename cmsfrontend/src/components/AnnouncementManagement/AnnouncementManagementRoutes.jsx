import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AnnouncementListContainer from './AnnouncementListContainer';
import AnnouncementFormContainer from './AnnouncementFormContainer';

const AnnouncementManagementRoutes = () => {
    return (
        <div className="announcement-management dashboard-section">
            <h2 className="dashboard-title">Announcement Management</h2>
            <nav className="dashboard-nav">
                <Link to="/announcements">Announcement List</Link>
                <Link to="/announcements/add">Create New Announcement</Link>
            </nav>
            <Routes>
                <Route path="/" element={<AnnouncementListContainer />} />
                <Route path="/add" element={<AnnouncementFormContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<AnnouncementFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default AnnouncementManagementRoutes;
