import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import TithesOfferingsList from './TithesOfferingsList';
import TithesOfferingsForm from './TithesOfferingsForm';
import ConfirmDialog from '../ConfirmDialog'; 
import Notification from '../Notification'; 
import { v4 as uuidv4 } from 'uuid'; 

const API_BASE = 'http://localhost:9001/api';

const TithesOfferingsContainer = () => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]); 
    const [editingContribution, setEditingContribution] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [contributionToDelete, setContributionToDelete] = useState(null);
    const navigate = useNavigate();
    const { id: paramId } = useParams();

    const addNotification = (message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const fetchContributions = useCallback(async () => {
        setLoading(true);
        setNotifications([]); 
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${API_BASE}/tithes-offerings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch tithes and offerings.');
            }
            const data = await response.json();
            setContributions(data.map(item => ({
                id: item.id,
                dateOfContribution: item.dateOfContribution,
                amount: item.amount,
            })));
            addNotification('Tithes and offerings loaded successfully!', 'success'); 
        } catch (err) {
            addNotification(err.message, 'error'); 
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchContributions();
    }, [fetchContributions]);

    useEffect(() => {
        if (paramId) {
            const contributionToEdit = contributions.find(c => String(c.id) === String(paramId));
            if (contributionToEdit) {
                setEditingContribution(contributionToEdit);
            } else if (!loading && contributions.length > 0) {
                setEditingContribution(null);
            }
        } else {
            setEditingContribution(null);
        }
    }, [paramId, contributions, loading]);

    const handleAddContribution = () => {
        setEditingContribution(null);
        navigate('/financial-management/tithes-offerings/add');
    };

    const handleEditContribution = (contribution) => {
        setEditingContribution(contribution);
        navigate(`/financial-management/tithes-offerings/edit/${contribution.id}`);
    };

    const handleDeleteClick = (id) => {
        setContributionToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        if (contributionToDelete) {
            setLoading(true);
            setNotifications([]);
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_BASE}/tithes-offerings/${contributionToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || 'Failed to delete tithe/offering.');
                }
                fetchContributions();
                addNotification('Tithe/offering deleted successfully!', 'success'); 
                navigate('/financial-management/tithes-offerings');
            } catch (err) {
                addNotification(err.message, 'error'); 
                console.error(err);
            } finally {
                setLoading(false);
                setContributionToDelete(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setContributionToDelete(null);
    };

    const handleSaveContribution = async (formData) => {
        setLoading(true);
        setNotifications([]);
        try {
            const token = localStorage.getItem('adminToken');
            const isUpdate = formData.id !== undefined && formData.id !== null && formData.id !== '';
            const url = isUpdate ? `${API_BASE}/tithes-offerings/${formData.id}` : `${API_BASE}/tithes-offerings`;
            const method = isUpdate ? 'PUT' : 'POST';

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
                throw new Error(errorData?.message || `Failed to ${isUpdate ? 'update' : 'add'} tithe/offering.`);
            }
            fetchContributions();
            addNotification(`Tithe/offering ${isUpdate ? 'updated' : 'added'} successfully!`, 'success'); 
            navigate('/financial-management/tithes-offerings');
        } catch (err) {
            addNotification(err.message, 'error'); 
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/financial-management/tithes-offerings');
        setEditingContribution(null);
    };

    return (
        <>
            {notifications.map((notif) => (
                <Notification
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    type={notif.type}
                    removeNotification={removeNotification}
                />
            ))}
            {loading && <p className="status red">Loading tithes and offerings...</p>}

            <Routes>
                <Route
                    path="/"
                    element={
                        <TithesOfferingsList
                            contributions={contributions}
                            onEdit={handleEditContribution}
                            onDelete={handleDeleteClick} 
                            onAdd={handleAddContribution}
                        />
                    }
                />
                <Route
                    path="/add"
                    element={
                        <TithesOfferingsForm
                            onSubmit={handleSaveContribution}
                            onCancel={handleCancel}
                            initialData={editingContribution || { dateOfContribution: new Date().toISOString().split('T')[0] }}
                        />
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        editingContribution ? (
                            <TithesOfferingsForm
                                onSubmit={handleSaveContribution}
                                onCancel={handleCancel}
                                initialData={editingContribution}
                            />
                        ) : (
                            <p className="status-message">Loading tithe/offering details for editing...</p>
                        )
                    }
                />
            </Routes>

            {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this tithe/offering?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default TithesOfferingsContainer;