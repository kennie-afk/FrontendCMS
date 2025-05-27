import React from 'react';

const EventList = ({ events, onEdit, onDelete }) => {
    return (
        <div className="member-list"> 
            <h2>Event List</h2>
            {events.length === 0 ? (
                <p className="warning">No events scheduled.</p>
            ) : (
                <table>
                    <caption>Upcoming Events</caption>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={event.id}>
                                <td>{index + 1}</td>
                                <td>{event.title}</td>
                                <td>{event.date}</td>
                                <td>{event.time}</td>
                                <td>{event.location}</td>
                                <td>{event.description}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => onEdit(event)}>Edit</button>
                                    <button className="delete-btn" onClick={() => onDelete(event.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EventList;