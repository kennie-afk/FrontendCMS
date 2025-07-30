import React, { useState, useEffect, useCallback } from 'react';
import FamilyList from './FamilyList';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification';
import ConfirmDialog from '../ConfirmDialog';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const FamilyListContainer = () => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [familyIdToDelete, setFamilyIdToDelete] = useState(null);
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchFamilies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setFamilies([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/families`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonParseError) {
                const textResponse = await response.text();
                console.error('JSON parsing error:', jsonParseError);
                console.error('Server returned non-JSON:', textResponse);
                addNotification(`Server sent invalid data. Error: ${textResponse.substring(0, 100)}...`, 'error');
                setError('Received invalid data from server.');
                setFamilies([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    setFamilies([]);
                    return;
                }
                throw new Error(data?.message || data?.error || `Failed to fetch families. Status: ${response.status}`);
            }

            if (!Array.isArray(data)) {
                console.error("API did not return an array for families:", data);
                addNotification('API returned unexpected data format. Expected an array.', 'error');
                setError('API returned unexpected data format.');
                setFamilies([]);
                setLoading(false);
                return;
            }

            setFamilies(data);
            addNotification('Families loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(`Error fetching families: ${err.message}`, 'error');
            console.error('Fetch error:', err);
            setFamilies([]);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchFamilies();
    }, [fetchFamilies]);

    const handleEdit = (family) => {
        navigate(`/families/edit/${family.familyId}`);
    };

    const handleDelete = (id) => {
        setFamilyIdToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/families/${familyIdToDelete}`, {
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
                throw new Error(errorData?.message || 'Failed to delete family.');
            }
            addNotification('Family deleted successfully!', 'success');
            fetchFamilies();
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
            setFamilyIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setFamilyIdToDelete(null);
    };

    const handleAddFamily = () => {
        navigate('/families/new');
    };

    const handleViewMembers = (familyId) => {
        navigate(`/families/${familyId}/members`); // Assuming a route to view family members
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
                    message="Are you sure you want to delete this family record? This will not delete associated members."
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            {loading ? (
                <p className="status red">Loading families...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <FamilyList
                    families={families}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddFamily={handleAddFamily}
                    onViewMembers={handleViewMembers}
                />
            )}
        </>
    );
};

export default FamilyListContainer;
