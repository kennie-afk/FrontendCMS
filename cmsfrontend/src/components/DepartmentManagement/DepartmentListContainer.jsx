import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentList from './DepartmentList';
import Notification from '../Notification';
import ConfirmDialog from '../ConfirmDialog';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const DepartmentListContainer = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [departmentToDeleteId, setDepartmentToDeleteId] = useState(null);
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/departments`, {
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
                throw new Error(errorData?.message || 'Failed to fetch departments.');
            }
            const data = await response.json();
            setDepartments(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleEdit = (department) => {
        navigate(`/departments/edit/${department.departmentId}`);
    };

    const handleDeleteClick = (departmentId) => {
        setDepartmentToDeleteId(departmentId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        if (!departmentToDeleteId) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/departments/${departmentToDeleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete department.');
            }
            addNotification('Department deleted successfully!', 'success');
            fetchDepartments();
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
            setDepartmentToDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDepartmentToDeleteId(null);
    };

    const handleAddDepartment = () => {
        navigate('/departments/add');
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
                    message="Are you sure you want to delete this department?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {loading && <p className="status red">Loading departments...</p>}
            {error && <p className="error">{error}</p>}

            <DepartmentList
                departments={departments}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onAdd={handleAddDepartment}
            />
        </>
    );
};

export default DepartmentListContainer;
