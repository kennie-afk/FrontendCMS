import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FamilyListContainer from './FamilyListContainer';
import FamilyFormContainer from './FamilyFormContainer';

const FamilyManagementRoutes = () => {
    return (
        <div className="family-management">
            <Routes>
                <Route path="/" element={<FamilyListContainer />} />
                <Route path="/new" element={<FamilyFormContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<FamilyFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default FamilyManagementRoutes;
