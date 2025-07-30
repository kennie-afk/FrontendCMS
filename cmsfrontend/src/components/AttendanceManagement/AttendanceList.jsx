import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';

const AttendanceList = ({ attendanceRecords, onEdit, onDelete, onAddAttendance }) => {
    if (!Array.isArray(attendanceRecords)) {
        return <div className="warning">Loading attendance records or no data available.</div>;
    }

    return (
        <div className="member-list">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: 'none', boxShadow: 'none', padding: '0' }}>
                <h2 className="dashboard-title" style={{ marginBottom: 0, textAlign: 'left' }}>Attendance List</h2>
                <button
                    onClick={onAddAttendance}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Attendance
                </button>
            </div>

            {attendanceRecords.length === 0 ? (
                <p className="warning">No attendance records found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <caption>Attendance Records</caption>
                        <thead>
                            <tr>
                                <th className="text-light">#</th>
                                <th className="text-light">Member Name</th>
                                <th className="text-light">Date</th>
                                <th className="text-light">Status</th>
                                <th className="text-light">Comments</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, index) => (
                                <tr key={record.attendanceId}>
                                    <td>{index + 1}</td>
                                    <td>{record.memberName}</td>
                                    <td>{format(new Date(record.attendanceDate), 'PPP')}</td>
                                    <td>{record.status}</td>
                                    <td>{record.comments || 'N/A'}</td>
                                    <td>
                                        <div className="actions-container" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button className="edit-btn" onClick={() => onEdit(record)}>Edit</button>
                                            <button className="delete-btn" onClick={() => onDelete(record.attendanceId)}>Delete</button>
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

export default AttendanceList;
