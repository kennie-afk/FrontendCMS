import React from 'react';
import { FaPlus } from 'react-icons/fa';

const MemberList = ({ members, onEdit, onDelete, onViewContributions, onAdd }) => {
    return (
        <div className="member-list">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'none', boxShadow: 'none', padding: '0' }}>
                <h2 className="dashboard-title" style={{ marginBottom: 0, textAlign: 'left' }}>Church Members</h2>
                <button
                    onClick={onAdd}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Member
                </button>
            </div>

            {members.length === 0 ? (
                <div className="warning">
                    No members registered yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="text-light">First Name</th>
                                <th className="text-light">Last Name</th>
                                <th className="text-light">Email</th>
                                <th className="text-light">Phone Number</th>
                                <th className="text-light">Gender</th>
                                <th className="text-light">Joined Date</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.memberId}>
                                    <td>{member.firstName}</td>
                                    <td>{member.lastName}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phoneNumber}</td>
                                    <td>{member.gender}</td>
                                    <td>{member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <div className="actions-container" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => onViewContributions(member.memberId)}
                                                className="view-btn"
                                            >
                                                Contributions
                                            </button>
                                            <button
                                                onClick={() => onEdit(member)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(member.memberId)}
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

export default MemberList;