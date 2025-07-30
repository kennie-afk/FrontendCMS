import React from 'react';
import { FaPlus } from 'react-icons/fa';

const EventList = ({ events, onEdit, onDelete, onAddEvent }) => {
    if (!Array.isArray(events)) {
        return <div className="warning">Loading events or no data available.</div>;
    }

    return (
        <div className="member-list">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Event List</h2>
                <button
                    onClick={onAddEvent}
                    className="add-btn"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add New Event
                </button>
            </div>

            {events.length === 0 ? (
                <div className="warning">
                    No events scheduled.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <caption>Upcoming Events</caption>
                        <thead>
                            <tr>
                                <th className="text-light">#</th>
                                <th className="text-light">Event Name</th>
                                <th className="text-light">Date</th>
                                <th className="text-light">Time</th>
                                <th className="text-light">Location</th>
                                <th className="text-light">Description</th>
                                <th className="text-light">Organizer</th>
                                <th className="text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={event.eventId}>
                                    <td>{index + 1}</td>
                                    <td>{event.eventName}</td>
                                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                                    <td>{event.eventTime}</td>
                                    <td>{event.eventLocation}</td>
                                    <td>{event.eventDescription}</td>
                                    <td>{event.organizerName || 'N/A'}</td>
                                    <td>
                                        <div className="actions-container">
                                            <button className="edit-btn" onClick={() => onEdit(event)}>Edit</button>
                                            <button className="delete-btn" onClick={() => onDelete(event.eventId)}>Delete</button>
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

export default EventList;
