import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SermonListContainer from './SermonListContainer';
import SermonFormContainer from './SermonFormContainer';

const SermonManagementRoutes = () => {
  return (
    <div className="sermon-management">
      <h2 className="dashboard-title">Sermon Management</h2>
      <Routes>
        <Route path="/" element={<SermonListContainer />} />
        <Route path="/add" element={<SermonFormContainer />} />
        <Route path="/edit/:id" element={<SermonFormContainer isEditing={true} />} />
      </Routes>
    </div>
  );
};

export default SermonManagementRoutes;