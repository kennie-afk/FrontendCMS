import React from 'react';

const AnnouncementList = ({ announcements, onEdit, onDelete }) => {
    return (
        <div className="member-list">
            <h2>Announcements</h2>
            {announcements.length === 0 ? (
                <p className="warning">No announcements yet.</p>
            ) : (
                <table>
                    <caption>Current Announcements</caption>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Type</th>
                            <th>Date Created</th>
                            <th>Effective From</th>
                            <th>Effective Until</th>
                            <th>Audience</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement, index) => (
                            <tr key={announcement.id}>
                                <td>{index + 1}</td>
                                <td>{announcement.title}</td>
                                <td>{announcement.message}</td>
                                <td>{announcement.announcementType}</td>
                                <td>{announcement.dateCreated}</td>
                                <td>{announcement.effectiveDate}</td>
                                <td>{announcement.effectiveUntil}</td>
                                <td>{announcement.targetAudience}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => onEdit(announcement)}>Edit</button>
                                    <button className="delete-btn" onClick={() => onDelete(announcement.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AnnouncementList;