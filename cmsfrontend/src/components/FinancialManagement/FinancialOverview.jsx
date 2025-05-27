import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaHandHoldingUsd, FaFileInvoiceDollar } from 'react-icons/fa';

const FinancialOverview = () => {
    return (
        <div className="dashboard-section">
            <h3 className="dashboard-title">Financial Management Overview</h3>
            <p>Select a financial section to manage:</p>

            <div className="dashboard-card-grid">
                <div className="dashboard-section-card">
                    <div className="card-icon"><FaMoneyBillWave /></div>
                    <h4 className="card-title">Tithes & Offerings</h4>
                    <p className="card-description">Manage general tithes and Sunday offerings.</p>
                    <Link to="tithes-offerings" className="card-link">Go to Tithes & Offerings</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaHandHoldingUsd /></div>
                    <h4 className="card-title">Individual Member Contributions</h4>
                    <p className="card-description">View and manage contributions for specific members.</p>
                    <Link to="/members" className="card-link">Go to Member Contributions</Link>
                </div>

                <div className="dashboard-section-card">
                    <div className="card-icon"><FaFileInvoiceDollar /></div>
                    <h4 className="card-title">All Member Contributions</h4>
                    <p className="card-description">View a comprehensive list of all member contributions.</p>
                    <Link to="all-member-contributions" className="card-link">Go to All Contributions</Link>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;