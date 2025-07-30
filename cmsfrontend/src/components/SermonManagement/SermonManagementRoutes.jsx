import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SermonListContainer from './SermonListContainer';
import SermonFormContainer from './SermonFormContainer';

const SermonManagementRoutes = () => {
 return (
    <div className="sermon-management dashboard-section">
        <h2 className="dashboard-title">Sermon Management</h2>
        <nav className="dashboard-nav">
            <Link to="/sermons">Sermon List</Link>
            <Link to="/sermons/new">Add New Sermon</Link>
        </nav>
        <Routes>
            <Route path="/" element={<SermonListContainer />} />
            <Route path="/new" element={<SermonFormContainer isEditing={false} />} />
            <Route path="/edit/:id" element={<SermonFormContainer isEditing={true} />} />
        </Routes>
    </div>
 );
};

export default SermonManagementRoutes;
