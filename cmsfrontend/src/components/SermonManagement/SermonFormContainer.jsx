import React, { useCallback, useState, useEffect } from 'react';
import SermonForm from './SermonForm';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:9001/api';

const SermonFormContainer = ({ isEditing }) => {
    const [editingSermon, setEditingSermon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchSermonToEdit = useCallback(async (sermonId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/sermons/${sermonId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch sermon for editing.');
            }
            const data = await response.json();
            setEditingSermon(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

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
            const url = isEditing ? `${API_BASE}/sermons/${formData.id}` : `${API_BASE}/sermons`;
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
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} sermon.`);
            }

            navigate('/sermons'); 
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && editingSermon === null) return <p className="status red">Loading sermon data...</p>;
    if (error) return <p className="error">{error}</p>;

    return <SermonForm onSubmit={handleSubmit} editingSermon={editingSermon} />;
};

export default SermonFormContainer;