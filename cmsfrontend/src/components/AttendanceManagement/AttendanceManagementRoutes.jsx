import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AttendanceListContainer from './AttendanceListContainer';
import AttendanceFormContainer from './AttendanceFormContainer';

const AttendanceManagementRoutes = () => {
    return (
        <div className="attendance-management">
            <Routes>
                <Route path="/" element={<AttendanceListContainer />} />
                <Route path="/new" element={<AttendanceFormContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<AttendanceFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default AttendanceManagementRoutes;
