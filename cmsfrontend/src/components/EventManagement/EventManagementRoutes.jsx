import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventListContainer from './EventListContainer';
import EventFormContainer from './EventFormContainer';

const EventManagementRoutes = () => {
    return (
        <div className="event-management">
            <h2 className="dashboard-title">Event Management</h2>
            <Routes>
                <Route path="/" element={<EventListContainer />} />
                <Route path="/add" element={<EventFormContainer />} />
                <Route path="/edit/:id" element={<EventFormContainer isEditing={true} />} />
            </Routes>
        </div>
    );
};

export default EventManagementRoutes;