import React, { useCallback, useState, useEffect } from 'react';
import AttendanceForm from './AttendanceForm';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const AttendanceFormContainer = ({ isEditing }) => {
    const [editingRecord, setEditingRecord] = useState(null);
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchInitialData = useCallback(async (recordId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setLoading(false);
                return;
            }

            const [membersResponse, recordResponse] = await Promise.all([
                fetch(`${API_BASE}/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
                isEditing ? fetch(`${API_BASE}/attendance/${recordId}`, { headers: { 'Authorization': `Bearer ${token}` } }) : Promise.resolve(null)
            ]);

            if (!membersResponse.ok) {
                const errorData = await membersResponse.json();
                throw new Error(errorData?.message || 'Failed to fetch members.');
            }
            const membersData = await membersResponse.json();
            setAllMembers(membersData);

            if (isEditing && recordResponse && !recordResponse.ok) {
                const errorData = await recordResponse.json();
                throw new Error(errorData?.message || 'Failed to fetch attendance record for editing.');
            }

            if (isEditing && recordResponse) {
                const recordData = await recordResponse.json();
                setEditingRecord(recordData);
            }

            addNotification('Data loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification, isEditing]);

    useEffect(() => {
        fetchInitialData(id);
    }, [fetchInitialData, id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing ? `${API_BASE}/attendance/${formData.attendanceId}` : `${API_BASE}/attendance`;
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
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} attendance record.`);
            }

            const successMessage = isEditing ? 'Attendance record updated successfully!' : 'Attendance record added successfully!';
            addNotification(successMessage, 'success');
            navigate('/attendance');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/attendance');
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

            {loading && <p className="status red">Loading data...</p>}
            {error && <p className="error">{error}</p>}
            {isEditing && !editingRecord && !loading && !error && <p className="warning">Attendance record not found.</p>}

            {!loading && (isEditing ? editingRecord !== null : true) && (
                <AttendanceForm
                    onSubmit={handleSubmit}
                    editingRecord={editingRecord}
                    onCancel={handleCancel}
                    allMembers={allMembers}
                />
            )}
        </>
    );
};

export default AttendanceFormContainer;
