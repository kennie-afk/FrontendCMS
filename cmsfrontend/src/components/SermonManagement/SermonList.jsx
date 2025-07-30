import React from 'react';
import { FaPlus } from 'react-icons/fa';

const SermonList = ({ sermons, onEdit, onDelete, onAddSermon }) => {
    if (!Array.isArray(sermons)) {
        return <div className="warning">Loading sermons or no data available.</div>;
    }

    return (
        <div className="member-list">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Sermon List</h2>
                <button
                    onClick={onAddSermon}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Sermon
                </button>
            </div>

            {sermons.length === 0 ? (
                <p className="warning">No sermons recorded.</p>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <caption>List of Sermons</caption>
                        <thead>
                            <tr>
                                <th className="text-light">#</th>
                                <th className="text-light">Title</th>
                                <th className="text-light">Theme</th>
                                <th className="text-light">Preacher Name</th>
                                <th className="text-light">Sermon Date</th>
                                <th className="text-light">Video URL</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sermons.map((sermon, index) => (
                                <tr key={sermon.sermonId}>
                                    <td>{index + 1}</td>
                                    <td>{sermon.title}</td>
                                    <td>{sermon.theme}</td>
                                    <td>{sermon.preacherName}</td>
                                    <td>{sermon.sermonDate ? new Date(sermon.sermonDate).toLocaleDateString() : 'N/A'}</td>
                                    <td><a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">{sermon.videoUrl ? 'Link' : 'N/A'}</a></td>
                                    <td>
                                        <div className="actions-container">
                                            <button className="edit-btn" onClick={() => onEdit(sermon)}>Edit</button>
                                            <button className="delete-btn" onClick={() => onDelete(sermon.sermonId)}>Delete</button>
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

export default SermonList;
