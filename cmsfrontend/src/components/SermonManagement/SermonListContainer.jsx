import React, { useState, useEffect, useCallback } from 'react';
import SermonList from './SermonList';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:9001/api';

const SermonListContainer = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSermons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/sermons`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch sermons.');
            }
            const data = await response.json();
            setSermons(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchSermons();
    }, [fetchSermons]);

    const handleEdit = (sermon) => {
        navigate(`/sermons/edit/${sermon.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sermon?')) {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_BASE}/sermons/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || 'Failed to delete sermon.');
                }
                fetchSermons();
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <p className="status red">Loading sermons...</p>;
    if (error) return <p className="error">{error}</p>;

    return <SermonList sermons={sermons} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default SermonListContainer;