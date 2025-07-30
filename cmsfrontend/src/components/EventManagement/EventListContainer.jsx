import React, { useState, useEffect, useCallback } from 'react';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification';
import ConfirmDialog from '../ConfirmDialog';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const EventListContainer = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setEvents([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            let data;
            try {
                data = await response.json();
            } catch {
                const textResponse = await response.text();
                addNotification(`Server sent invalid data. Error: ${textResponse.substring(0, 100)}...`, 'error');
                setError('Received invalid data from server.');
                setEvents([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    setEvents([]);
                    return;
                }
                throw new Error(data?.message || data?.error || `Failed to fetch events. Status: ${response.status}`);
            }

            if (!Array.isArray(data)) {
                addNotification('API returned unexpected data format. Expected an array.', 'error');
                setError('API returned unexpected data format.');
                setEvents([]);
                setLoading(false);
                return;
            }

            setEvents(data);
            addNotification('Events loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(`Error fetching events: ${err.message}`, 'error');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEdit = (event) => {
        navigate(`/events/edit/${event.eventId}`);
    };

    const handleDelete = (id) => {
        setEventIdToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/events/${eventIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete event.');
            }
            addNotification('Event deleted successfully!', 'success');
            fetchEvents();
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
            setEventIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setEventIdToDelete(null);
    };

    const handleAddEvent = () => {
        navigate('/events/new');
    };

    return (
        <>
            <div className="notification-container">
                {notifications.map((notif) => (
                    <Notification
                        key={notif.id}
                        id={notif.id}
                        message={notif.message}
                        type={notif.type}
                        removeNotification={removeNotification}
                    />
                ))}
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this event?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            {loading ? (
                <p className="status red">Loading events...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <EventList
                    events={events}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddEvent={handleAddEvent}
                />
            )}
        </>
    );
};

export default EventListContainer;
