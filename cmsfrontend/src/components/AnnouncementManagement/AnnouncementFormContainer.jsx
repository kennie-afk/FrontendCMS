import React, { useCallback, useState, useEffect } from 'react';
import AnnouncementForm from './AnnouncementForm';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../Notification'; 
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const AnnouncementFormContainer = ({ isEditing }) => {
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]); 
    const navigate = useNavigate();
    const { id } = useParams();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchAnnouncementToEdit = useCallback(async (announcementId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/announcements/${announcementId}`, {
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
                throw new Error(errorData?.message || 'Failed to fetch announcement for editing.');
            }
            const data = await response.json();
            setEditingAnnouncement(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        if (isEditing && id) {
            fetchAnnouncementToEdit(id);
        } else {
            setEditingAnnouncement(null);
        }
    }, [isEditing, id, fetchAnnouncementToEdit]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const payload = { ...formData };
            if (!isEditing) {
                delete payload.id;
            }

            const url = isEditing ? `${API_BASE}/announcements/${payload.id}` : `${API_BASE}/announcements`;
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
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} announcement.`);
            }

            const successMessage = isEditing ? 'Announcement updated successfully!' : 'Announcement published successfully!';
            addNotification(successMessage, 'success');
            navigate('/announcements');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/announcements');
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
            {loading && isEditing && editingAnnouncement === null && <p className="status red">Loading announcement data...</p>}
            {error && <p className="error">{error}</p>} 
            <AnnouncementForm
                onSubmit={handleSubmit}
                editingAnnouncement={editingAnnouncement}
                onCancel={handleCancel}
            />
        </>
    );
};

export default AnnouncementFormContainer;