import React, { useState, useEffect, useCallback } from 'react';
import AttendanceList from './AttendanceList';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification';
import ConfirmDialog from '../ConfirmDialog';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const AttendanceListContainer = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [attendanceIdToDelete, setAttendanceIdToDelete] = useState(null);
    const navigate = useNavigate();

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchAttendanceRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                addNotification('Authentication token missing. Please log in.', 'error');
                navigate('/login');
                setAttendanceRecords([]);
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/attendance`, {
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
                setAttendanceRecords([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    addNotification('Authentication failed. Please log in.', 'error');
                    navigate('/login');
                    setAttendanceRecords([]);
                    return;
                }
                throw new Error(data?.message || data?.error || `Failed to fetch attendance records. Status: ${response.status}`);
            }

            if (!Array.isArray(data)) {
                console.error("API did not return an array for attendance records:", data);
                addNotification('API returned unexpected data format. Expected an array.', 'error');
                setError('API returned unexpected data format.');
                setAttendanceRecords([]);
                setLoading(false);
                return;
            }

            setAttendanceRecords(data);
            addNotification('Attendance records loaded successfully!', 'success');

        } catch (err) {
            setError(err.message);
            addNotification(`Error fetching attendance records: ${err.message}`, 'error');
            console.error('Fetch error:', err);
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    }, [navigate, addNotification]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, [fetchAttendanceRecords]);

    const handleEdit = (record) => {
        navigate(`/attendance/edit/${record.attendanceId}`);
    };

    const handleDelete = (id) => {
        setAttendanceIdToDelete(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/attendance/${attendanceIdToDelete}`, {
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
                throw new Error(errorData?.message || 'Failed to delete attendance record.');
            }
            addNotification('Attendance record deleted successfully!', 'success');
            fetchAttendanceRecords();
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
            setAttendanceIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setAttendanceIdToDelete(null);
    };

    const handleAddAttendance = () => {
        navigate('/attendance/new');
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
                    message="Are you sure you want to delete this attendance record?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            {loading ? (
                <p className="status red">Loading attendance records...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <AttendanceList
                    attendanceRecords={attendanceRecords}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddAttendance={handleAddAttendance}
                />
            )}
        </>
    );
};

export default AttendanceListContainer;
