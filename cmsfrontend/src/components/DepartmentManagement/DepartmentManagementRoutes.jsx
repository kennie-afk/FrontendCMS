import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DepartmentListContainer from './DepartmentListContainer';
import DepartmentRegistrationContainer from './DepartmentRegistrationContainer';

const DepartmentManagementRoutes = () => {
    return (
        <div className="department-management dashboard-section">
            <h2 className="dashboard-title">Department Management</h2>
            <nav className="dashboard-nav">
                <Link to="/departments">Department List</Link>
                <Link to="/departments/add">Add New Department</Link>
            </nav>
            <Routes>
                <Route path="/" element={<DepartmentListContainer />} />
                <Route path="/add" element={<DepartmentRegistrationContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<DepartmentRegistrationContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default DepartmentManagementRoutes;
