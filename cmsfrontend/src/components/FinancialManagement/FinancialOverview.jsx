import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingUsd, FaFileInvoiceDollar } from 'react-icons/fa'; 

const FinancialOverview = () => {
    return (
        <div className="dashboard-section">
            <h3 className="dashboard-title">Financial Management Overview</h3>
            <p>Select a financial section to manage:</p>

            <div className="dashboard-card-grid">
                <Link to="/members" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaHandHoldingUsd /></div>
                        <h4 className="card-title">Individual Member Contributions</h4>
                        <p className="card-description">View and manage contributions for specific members (includes tithes & offerings).</p>
                        <span className="card-link">Go to Member Contributions</span>
                    </div>
                </Link>

                <Link to="all-member-contributions" className="dashboard-section-card-link">
                    <div className="dashboard-section-card">
                        <div className="card-icon"><FaFileInvoiceDollar /></div>
                        <h4 className="card-title">All Member Contributions</h4>
                        <p className="card-description">View a comprehensive list of all member contributions (includes tithes & offerings).</p>
                        <span className="card-link">Go to All Contributions</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default FinancialOverview;