import React from 'react';
import { FaPlus } from 'react-icons/fa';

const FamilyList = ({ families, onEdit, onDelete, onAddFamily, onViewMembers }) => {
    if (!Array.isArray(families)) {
        return <div className="warning">Loading families or no data available.</div>;
    }

    return (
        <div className="member-list">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'none', boxShadow: 'none', padding: '0' }}>
                <h2 className="dashboard-title" style={{ marginBottom: 0, textAlign: 'left' }}>Family List</h2>
                <button
                    onClick={onAddFamily}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Family
                </button>
            </div>

            {families.length === 0 ? (
                <p className="warning">No families recorded.</p>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <caption>Registered Families</caption>
                        <thead>
                            <tr>
                                <th className="text-light">#</th>
                                <th className="text-light">Family Name</th>
                                <th className="text-light">Head of Family</th>
                                <th className="text-light">Contact Email</th>
                                <th className="text-light">Contact Phone</th>
                                <th className="text-light">Address</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {families.map((family, index) => (
                                <tr key={family.familyId}>
                                    <td>{index + 1}</td>
                                    <td>{family.familyName}</td>
                                    <td>{family.headOfFamilyName || 'N/A'}</td>
                                    <td>{family.contactEmail || 'N/A'}</td>
                                    <td>{family.contactPhone || 'N/A'}</td>
                                    <td>{family.address || 'N/A'}</td>
                                    <td>
                                        <div className="actions-container" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button className="view-btn" onClick={() => onViewMembers(family.familyId)}>Members</button>
                                            <button className="edit-btn" onClick={() => onEdit(family)}>Edit</button>
                                            <button className="delete-btn" onClick={() => onDelete(family.familyId)}>Delete</button>
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

export default FamilyList;
