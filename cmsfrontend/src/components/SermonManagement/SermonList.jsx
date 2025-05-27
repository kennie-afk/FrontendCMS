import React from 'react';

const SermonList = ({ sermons, onEdit, onDelete }) => {
    return (
        <div className="member-list">
            <h2>Sermon List</h2>
            {sermons.length === 0 ? (
                <p className="warning">No sermons recorded.</p>
            ) : (
                <table>
                    <caption>List of Sermons</caption>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Speaker</th>
                            <th>Date</th>
                            <th>URL</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sermons.map((sermon, index) => (
                            <tr key={sermon.id}>
                                <td>{index + 1}</td>
                                <td>{sermon.title}</td>
                                <td>{sermon.speaker}</td>
                                <td>{sermon.date}</td>
                                <td>{sermon.url}</td>
                                <td>{sermon.description}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => onEdit(sermon)}>Edit</button>
                                    <button className="delete-btn" onClick={() => onDelete(sermon.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SermonList;