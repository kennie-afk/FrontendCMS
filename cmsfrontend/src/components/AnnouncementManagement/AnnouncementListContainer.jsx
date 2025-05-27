import React, { useState, useEffect, useCallback } from 'react';
import AnnouncementList from './AnnouncementList';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification'; 
import ConfirmDialog from '../ConfirmDialog'; 
import { v4 as uuidv4 } from 'uuid'; 

const API_BASE = 'http://localhost:9001/api';

const AnnouncementListContainer = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false); 
    const [announcementToDelete, setAnnouncementToDelete] = useState(null); 
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/announcements`, {
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
                throw new Error(errorData?.message || 'Failed to fetch announcements.');
            }
            const data = await response.json();
            setAnnouncements(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleEdit = (announcement) => {
        navigate(`/announcements/edit/${announcement.id}`);
    };

    const handleDeleteClick = (id) => {
        setAnnouncementToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false); 
        if (!announcementToDelete) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/announcements/${announcementToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete announcement.');
            }
            addNotification('Announcement deleted successfully!', 'success');
            fetchAnnouncements(); 
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
            setAnnouncementToDelete(null); 
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setAnnouncementToDelete(null);
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
                    message="Are you sure you want to delete this announcement?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {loading && <p className="status red">Loading announcements...</p>}
            {error && <p className="error">{error}</p>} 

            <AnnouncementList announcements={announcements} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </>
    );
};

export default AnnouncementListContainer;