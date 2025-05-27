import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnnouncementListContainer from './AnnouncementListContainer';
import AnnouncementFormContainer from './AnnouncementFormContainer';

const AnnouncementManagementRoutes = () => {
    return (
        <div className="announcement-management">
            <h2 className="dashboard-title">Announcement Management</h2>
            <Routes>
                <Route path="/" element={<AnnouncementListContainer />} />
                <Route path="/add" element={<AnnouncementFormContainer />} />
                <Route path="/edit/:id" element={<AnnouncementFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default AnnouncementManagementRoutes;