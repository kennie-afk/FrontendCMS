import React from 'react';
import { FaPlus } from 'react-icons/fa';

const DepartmentList = ({ departments, onEdit, onDelete, onAdd }) => {
    return (
        <div className="member-list">
            <div className="dashboard-header">
                <h2 className="dashboard-title" style={{ textAlign: 'left' }}>Church Departments</h2>
                <button
                    onClick={onAdd}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Department
                </button>
            </div>

            {departments.length === 0 ? (
                <div className="warning">
                    No departments registered yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="text-light">Name</th>
                                <th className="text-light">Description</th>
                                <th className="text-light">Leader Full Name</th>
                                <th className="text-light">Created Date</th>
                                <th className="text-light">Meeting Schedule</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.departmentId}>
                                    <td>{department.name}</td>
                                    <td>{department.description}</td>
                                    <td>{department.leaderFullName}</td>
                                    <td>{department.createdDate ? new Date(department.createdDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{department.meetingSchedule || 'N/A'}</td>
                                    <td>
                                        <div className="actions-container">
                                            <button
                                                onClick={() => onEdit(department)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(department.departmentId)}
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

export default DepartmentList;
