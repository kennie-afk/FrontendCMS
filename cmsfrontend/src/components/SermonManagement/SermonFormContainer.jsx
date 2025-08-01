import React, { useCallback, useState, useEffect } from 'react';
import SermonForm from './SermonForm';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const SermonFormContainer = ({ isEditing }) => {
    const [editingSermon, setEditingSermon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prevNotifications) => [...prevNotifications, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    }, []);

    const fetchSermonToEdit = useCallback(async (sermonId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setEditingSermon(null);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/sermons/${sermonId}`, {
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
                throw new Error(errorData?.message || 'Failed to fetch sermon for editing.');
            }
            const data = await response.json();
            setEditingSermon(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification, navigate]);

    useEffect(() => {
        if (isEditing && id) {
            fetchSermonToEdit(id);
        } else {
            setEditingSermon(null);
        }
    }, [isEditing, id, fetchSermonToEdit]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                sermonId: formData.sermonId,
                title: formData.title,
                theme: formData.theme,
                sermonDate: formData.sermonDate,
                videoUrl: formData.videoUrl,
                preacherId: formData.preacherId ? parseInt(formData.preacherId) : null,
                preacherName: formData.preacherName,
            };

            const url = isEditing ? `${API_BASE}/sermons/${formData.sermonId}` : `${API_BASE}/sermons`;
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
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} sermon.`);
            }

            const successMessage = isEditing ? 'Sermon updated successfully!' : 'Sermon added successfully!';
            addNotification(successMessage, 'success');
            navigate('/sermons');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/sermons');
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

            {loading && isEditing && editingSermon === null && <p className="status red">Loading sermon data...</p>}
            {error && <p className="error">{error}</p>}
            {isEditing && !editingSermon && !loading && !error && <p className="warning">Sermon not found.</p>}

            <SermonForm onSubmit={handleSubmit} editingSermon={editingSermon} onCancel={handleCancel} />
        </>
    );
};

export default SermonFormContainer;
