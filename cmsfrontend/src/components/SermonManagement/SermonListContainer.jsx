import React, { useCallback, useState, useEffect } from 'react';
import SermonList from './SermonList';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const SermonListContainer = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [sermonToDeleteId, setSermonToDeleteId] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prevNotifications) => [...prevNotifications, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    }, []);

    const fetchSermons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setSermons([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/sermons`, {
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
                setSermons([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    setSermons([]);
                    return;
                }
                throw new Error(data?.message || data?.error || `Failed to fetch sermons. Status: ${response.status}`);
            }

            if (!Array.isArray(data)) {
                addNotification('API returned unexpected data format. Expected an array.', 'error');
                setError('API returned unexpected data format.');
                setSermons([]);
                setLoading(false);
                return;
            }

            setSermons(data);
            addNotification('Sermons loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(`Error fetching sermons: ${err.message}`, 'error');
            setSermons([]);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchSermons();
    }, [fetchSermons]);

    const handleEdit = (sermon) => {
        navigate(`/sermons/edit/${sermon.sermonId}`);
    };

    const handleDeleteClick = (sermonId) => {
        setSermonToDeleteId(sermonId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        if (!sermonToDeleteId) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/sermons/${sermonToDeleteId}`, {
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
                throw new Error(errorData?.message || 'Failed to delete sermon.');
            }
            fetchSermons();
            addNotification('Sermon deleted successfully!', 'success');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
            setSermonToDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setSermonToDeleteId(null);
    };

    const handleAddSermon = () => {
        navigate('/sermons/new');
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

            {loading ? (
                <p className="status red">Loading sermons...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <SermonList
                    sermons={sermons}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAddSermon={handleAddSermon}
                />
            )}

            {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this sermon?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default SermonListContainer;
