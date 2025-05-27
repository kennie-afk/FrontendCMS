import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';


const TithesOfferingsList = ({ contributions, onEdit, onDelete, onAdd }) => {
    return (
        <div className="member-list">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'none', boxShadow: 'none', padding: '0' }}>
                <h2 className="dashboard-title" style={{ marginBottom: 0, textAlign: 'left' }}>Tithes & Offerings Overview</h2>
                <button
                    onClick={onAdd}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add Tithe/Offering
                </button>
            </div>

            {contributions.length === 0 ? (
                <div className="warning">
                    No tithes or offerings recorded yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="text-light">ID</th>
                                <th className="text-light">Date</th>
                                <th className="text-light">Amount</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contributions.map((contribution) => (
                                <tr key={contribution.id}>
                                    <td>{contribution.id}</td>
                                    <td>{format(new Date(contribution.dateOfContribution), 'PPP')}</td>
                                    <td>${Number(contribution.amount).toFixed(2)}</td>
                                    <td>
                                        <div className="actions-container" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => onEdit(contribution)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(contribution.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TithesOfferingsList;