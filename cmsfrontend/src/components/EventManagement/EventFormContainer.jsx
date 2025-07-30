import React, { useCallback, useState, useEffect } from 'react';
import EventForm from './EventForm';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const EventFormContainer = ({ isEditing }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const addNotification = useCallback((message, type) => {
        const notificationId = uuidv4();
        setNotifications((prev) => [...prev, { id: notificationId, message, type }]);
    }, []);

    const removeNotification = useCallback((notificationId) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    }, []);

    const fetchEventToEdit = useCallback(async (eventId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setEditingEvent(null);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/events/${eventId}`, {
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
                throw new Error(errorData?.message || 'Failed to fetch event for editing.');
            }
            const data = await response.json();
            setEditingEvent(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification, navigate]);

    useEffect(() => {
        if (isEditing && id) {
            fetchEventToEdit(id);
        } else {
            setEditingEvent(null);
        }
    }, [isEditing, id, fetchEventToEdit]);

    const createAnnouncementForEvent = async (eventData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const newAnnouncement = {
                title: `New Event: ${eventData.eventName}`,
                message: `Mark your calendars! A new event has been scheduled: "${eventData.eventName}" on ${new Date(eventData.eventDate).toLocaleDateString()} at ${eventData.eventTime} located at ${eventData.eventLocation}. Details: ${eventData.eventDescription}. Organized by: ${eventData.organizerName}.`,
                announcementType: 'EVENT',
                dateCreated: new Date().toISOString().split('T')[0],
                effectiveDate: eventData.eventDate,
                effectiveUntil: eventData.eventDate,
                targetAudience: 'ALL_MEMBERS',
            };

            const response = await fetch(`${API_BASE}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newAnnouncement),
            });

            if (!response.ok) {
                const errorData = await response.json();
                addNotification(`Failed to create announcement for event: ${errorData?.message || 'Unknown error'}`, 'error');
            } else {
                addNotification('Announcement for event created successfully!', 'success');
            }
        } catch (err) {
            addNotification(`Error creating announcement: ${err.message}`, 'error');
        }
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                eventId: formData.eventId,
                eventName: formData.eventName,
                eventDate: formData.eventDate,
                eventTime: formData.eventTime,
                eventLocation: formData.eventLocation,
                eventDescription: formData.eventDescription,
                organizerId: formData.organizerId ? parseInt(formData.organizerId) : null,
                organizerName: formData.organizerName,
            };

            const url = isEditing ? `${API_BASE}/events/${formData.eventId}` : `${API_BASE}/events`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} event.`);
            }

            const successMessage = isEditing ? 'Event updated successfully!' : 'Event added successfully!';
            addNotification(successMessage, 'success');

            if (!isEditing) {
                await createAnnouncementForEvent(payload);
            }

            navigate('/events');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/events');
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

            {loading && isEditing && editingEvent === null && <p className="status red">Loading event data...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && (!isEditing || editingEvent) && (
                <EventForm
                    onSubmit={handleSubmit}
                    editingEvent={editingEvent}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                />
            )}
        </>
    );
};

export default EventFormContainer;
