import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MemberListContainer from './MemberListContainer';
import MemberRegistrationContainer from './MemberRegistrationContainer';
import MemberContributionContainer from '../FinancialManagement/MemberContributionContainer';

const MemberManagementRoutes = () => {
    return (
        <div className="member-management dashboard-section">
            <h2 className="dashboard-title">Member Management</h2>
            <nav className="dashboard-nav">
                <Link to="/members">Member List</Link>
                <Link to="/members/add">Add New Member</Link>
            </nav>
            <Routes>
                <Route path="/" element={<MemberListContainer />} />
                <Route path="/add" element={<MemberRegistrationContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<MemberRegistrationContainer isEditing={true} />} />
                <Route path="/:id/contributions/*" element={<MemberContributionContainer />} />
            </Routes>
        </div>
    );
};

export default MemberManagementRoutes;