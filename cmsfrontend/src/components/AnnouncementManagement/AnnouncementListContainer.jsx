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
    const [announcementToDeleteId, setAnnouncementToDeleteId] = useState(null);
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
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setAnnouncements([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/announcements`, {
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
                setAnnouncements([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    setAnnouncements([]);
                    return;
                }
                throw new Error(data?.message || data?.error || `Failed to fetch announcements. Status: ${response.status}`);
            }

            if (!Array.isArray(data)) {
                addNotification('API returned unexpected data format. Expected an array.', 'error');
                setError('API returned unexpected data format.');
                setAnnouncements([]);
                setLoading(false);
                return;
            }

            setAnnouncements(data);
            addNotification('Announcements loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(`Error fetching announcements: ${err.message}`, 'error');
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleEdit = (announcement) => {
        navigate(`/announcements/edit/${announcement.announcementId}`);
    };

    const handleDeleteClick = (announcementId) => {
        setAnnouncementToDeleteId(announcementId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        if (!announcementToDeleteId) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/announcements/${announcementToDeleteId}`, {
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
                throw new Error(errorData?.message || 'Failed to delete announcement.');
            }
            addNotification('Announcement deleted successfully!', 'success');
            fetchAnnouncements();
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
            setAnnouncementToDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setAnnouncementToDeleteId(null);
    };

    const handleAddAnnouncement = () => {
        navigate('/announcements/add');
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

            <AnnouncementList
                announcements={announcements}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onAddAnnouncement={handleAddAnnouncement}
            />
        </>
    );
};

export default AnnouncementListContainer;
