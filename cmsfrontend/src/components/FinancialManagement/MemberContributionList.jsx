import React from 'react';
import { FaPlus } from 'react-icons/fa';

const MemberContributionList = ({ contributions, members, onEdit, onDelete, onAdd }) => {
    return (
        <div className="member-list">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'none', boxShadow: 'none', padding: '0' }}>
                <h2 className="dashboard-title" style={{ marginBottom: 0, textAlign: 'left' }}>Member Contributions Overview</h2>
                <button
                    onClick={onAdd}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add Contribution
                </button>
            </div>

            {contributions.length === 0 ? (
                <div className="warning">
                    No contributions recorded for this member yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="text-light">Member ID</th>
                                <th className="text-light">Member Name</th> 
                                <th className="text-light">Date</th>
                                <th className="text-light">Amount</th>
                                <th className="text-light">Mode of Payment</th>
                                <th className="text-light">Comments</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contributions.map((contribution) => {
                                const member = members.find(m => m.id === contribution.memberId);
                                const contributorName = member ? member.fullName : 'N/A';

                                return (
                                    <tr key={contribution.id}>
                                        <td>{contribution.memberId}</td>
                                        <td>{contributorName}</td> 
                                        <td>{new Date(contribution.dateOfContribution).toLocaleDateString()}</td>
                                        <td>${Number(contribution.amount).toFixed(2)}</td>
                                        <td>{contribution.modeOfPayment}</td>
                                        <td>{contribution.comments || 'N/A'}</td>
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MemberContributionList;