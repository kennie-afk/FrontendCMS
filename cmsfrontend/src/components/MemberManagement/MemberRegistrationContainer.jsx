import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MemberRegistration from './MemberRegistration';
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:9001/api';

const MemberRegistrationContainer = ({ isEditing }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const fetchMember = useCallback(async () => {
        if (!isEditing || !id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/members/${id}`, {
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
                throw new Error(errorData?.message || 'Failed to fetch member data.');
            }
            const data = await response.json();
            setMemberData(data);
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [isEditing, id, navigate, addNotification]);

    useEffect(() => {
        fetchMember();
    }, [fetchMember]);

    const handleSaveMember = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                memberId: formData.memberId, 
                familyId: formData.familyId || null,
                departmentId: formData.departmentId || null,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                maritalStatus: formData.maritalStatus,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                country: formData.country,
                city: formData.city,
                postalCode: formData.postalCode,
                baptismStatus: formData.baptismStatus,
                baptismDate: formData.baptismStatus ? formData.baptismDate : null, // Send null if not baptized
                joinedDate: formData.joinedDate,
                occupation: formData.occupation,
                roleInChurch: formData.roleInChurch,
                profilePictureUrl: formData.profilePictureUrl,
            };

            const url = isEditing ? `${API_BASE}/members/${id}` : `${API_BASE}/members`;
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
                throw new Error(errorData?.message || `Failed to ${isEditing ? 'update' : 'add'} member.`);
            }

            const successMessage = isEditing ? 'Member updated successfully!' : 'Member registered successfully!';
            addNotification(successMessage, 'success');
            navigate('/members');
        } catch (err) {
            setError(err.message);
            addNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/members');
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

            {loading && isEditing && memberData === null && <p className="status red">Loading member data...</p>}
            {error && <p className="error">{error}</p>}
            {isEditing && !memberData && !loading && !error && <p className="warning">Member not found.</p>}

            <MemberRegistration
                onSubmit={handleSaveMember}
                initialData={isEditing ? memberData : null}
                onCancel={handleCancel}
                isEditing={isEditing}
            />
        </>
    );
};

export default MemberRegistrationContainer;