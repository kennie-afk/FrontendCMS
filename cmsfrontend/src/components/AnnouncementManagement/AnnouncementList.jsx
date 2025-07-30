import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AnnouncementList = ({ announcements, onEdit, onDelete, onAddAnnouncement }) => {
    if (!Array.isArray(announcements)) {
        return <div className="warning">Loading announcements or no data available.</div>;
    }

    return (
        <div className="member-list">
            <div className="dashboard-header">
                <h2 className="dashboard-title" style={{ textAlign: 'left' }}>Announcements</h2>
                <button
                    onClick={onAddAnnouncement}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Create New Announcement
                </button>
            </div>

            {announcements.length === 0 ? (
                <div className="warning">
                    No announcements yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <caption>Current Announcements</caption>
                        <thead>
                            <tr>
                                <th className="text-light">#</th>
                                <th className="text-light">Title</th>
                                <th className="text-light">Message</th>
                                <th className="text-light">Target Audience</th>
                                <th className="text-light">Status</th>
                                <th className="text-light">Start Date</th>
                                <th className="text-light">End Date</th>
                                <th className="text-light">Created At</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((announcement, index) => (
                                <tr key={announcement.announcementId}>
                                    <td>{index + 1}</td>
                                    <td>{announcement.title}</td>
                                    <td>{announcement.message}</td>
                                    <td>{announcement.targetAudience || 'All'}</td>
                                    <td>{announcement.status}</td>
                                    <td>{announcement.startDate ? new Date(announcement.startDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{announcement.endDate ? new Date(announcement.endDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : 'N/A'}</td>
                                    <td>
                                        <div className="actions-container">
                                            <button className="edit-btn" onClick={() => onEdit(announcement)}>Edit</button>
                                            <button className="delete-btn" onClick={() => onDelete(announcement.announcementId)}>Delete</button>
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

export default AnnouncementList;
