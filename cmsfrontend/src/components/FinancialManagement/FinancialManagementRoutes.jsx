import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import TithesOfferingsContainer from './TithesOfferingsContainer';
import MemberContributionContainer from './MemberContributionContainer';
import GeneralMemberContributionsContainer from './GeneralMemberContributionsContainer';
import FinancialOverview from './FinancialOverview';

const FinancialManagementRoutes = () => {
    return (
        <div className="dashboard-section">
            <h2 className="dashboard-title">Financial Management</h2>
            <nav className="dashboard-nav">
                <ul>
                    <li>
                        <NavLink to="tithes-offerings" className={({ isActive }) => isActive ? "active" : ""}>
                            Tithes & Offerings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="member-contributions" className={({ isActive }) => isActive ? "active" : ""}>
                            Member Contributions (Individual)
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="all-member-contributions" className={({ isActive }) => isActive ? "active" : ""}>
                            All Member Contributions
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div>
                <Routes>
                    <Route index element={<FinancialOverview />} />
                    <Route path="tithes-offerings/*" element={<TithesOfferingsContainer />} />
                    <Route path="member-contributions/*" element={<MemberContributionContainer />} />
                    <Route path="all-member-contributions" element={<GeneralMemberContributionsContainer />} />
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};

export default FinancialManagementRoutes;