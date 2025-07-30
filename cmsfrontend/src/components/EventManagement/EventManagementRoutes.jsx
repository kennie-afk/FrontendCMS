import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EventListContainer from './EventListContainer';
import EventFormContainer from './EventFormContainer';

const EventManagementRoutes = () => {
    return (
        <div className="event-management dashboard-section">
            <h2 className="dashboard-title">Event Management</h2>
            <nav className="dashboard-nav">
                <Link to="/events">Event List</Link>
                <Link to="/events/new">Add New Event</Link>
            </nav>
            <Routes>
                <Route path="/" element={<EventListContainer />} />
                <Route path="/new" element={<EventFormContainer isEditing={false} />} />
                <Route path="/edit/:id" element={<EventFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default EventManagementRoutes;
