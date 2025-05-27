import React, { useState, useEffect, useCallback } from 'react';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:9001/api';

const EventListContainer = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch events.');
            }
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEdit = (event) => {
        navigate(`/events/edit/${event.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_BASE}/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || 'Failed to delete event.');
                }
                fetchEvents();
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <p className="status red">Loading events...</p>;
    if (error) return <p className="error">{error}</p>;

    return <EventList events={events} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default EventListContainer;