import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DepartmentRegistration from './DepartmentRegistration';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const DepartmentRegistrationContainer = ({ isEditing }) => {
    const [initialData, setInitialData] = useState(null);
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

    const fetchDepartment = useCallback(async (departmentId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/departments/${departmentId}`, {
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
                throw new Error(errorData?.message || 'Failed to fetch department details.');
            }
            const data = await response.json();
            setInitialData(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        if (isEditing && id) {
            fetchDepartment(id);
        } else {
            setInitialData(null);
        }
    }, [isEditing, id, fetchDepartment]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing ? `${API_BASE}/departments/${formData.departmentId}` : `${API_BASE}/departments`;
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
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'create'} department.`);
            }

            addNotification(`Department ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
            navigate('/departments');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/departments');
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

            {loading && <p className="status red">Loading department data...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && (!isEditing || initialData) && (
                <DepartmentRegistration
                    onSubmit={handleSubmit}
                    initialData={isEditing ? initialData : null}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                />
            )}
        </>
    );
};

export default DepartmentRegistrationContainer;
