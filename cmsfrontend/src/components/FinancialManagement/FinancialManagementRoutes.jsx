import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MemberContributionContainer from './MemberContributionContainer';
import GeneralMemberContributionsContainer from './GeneralMemberContributionsContainer';
import FinancialOverview from './FinancialOverview';

const FinancialManagementRoutes = () => {
    return (
        <div className="financial-content">
            <Routes>
                <Route index element={<FinancialOverview />} />
                <Route path="overview" element={<FinancialOverview />} />
                <Route path="member-contributions/*" element={<MemberContributionContainer />} />
                <Route path="all-member-contributions" element={<GeneralMemberContributionsContainer />} />
            </Routes>
        </div>
    );
};

export default FinancialManagementRoutes;