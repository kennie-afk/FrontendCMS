import React, { useCallback, useState, useEffect } from 'react';
import EventForm from './EventForm';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:9001/api';

const EventFormContainer = ({ isEditing }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchEventToEdit = useCallback(async (eventId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch event for editing.');
            }
            const data = await response.json();
            setEditingEvent(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isEditing && id) {
            fetchEventToEdit(id);
        } else {
            setEditingEvent(null);
        }
    }, [isEditing, id, fetchEventToEdit]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing ? `${API_BASE}/events/${formData.id}` : `${API_BASE}/events`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} event.`);
            }

            navigate('/events');
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && editingEvent === null) return <p className="status red">Loading event data...</p>;
    if (error) return <p className="error">{error}</p>;

    return <EventForm onSubmit={handleSubmit} editingEvent={editingEvent} />;
};

export default EventFormContainer;