import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralMemberContributionsList from './GeneralMemberContributionsList';
import { v4 as uuidv4 } from 'uuid'; 
import Notification from '../Notification'; 

const API_BASE = 'http://localhost:9001/api';

const GeneralMemberContributionsContainer = () => {
    const [allContributions, setAllContributions] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]); 
    const navigate = useNavigate();

    const addNotification = (message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const fetchAllContributionsAndMembers = useCallback(async () => {
        setLoading(true);
        setNotifications([]); 
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const membersResponse = await fetch(`${API_BASE}/members`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!membersResponse.ok) {
                const errorData = await membersResponse.json();
                throw new Error(errorData?.message || 'Failed to fetch members for name resolution.');
            }
            const membersData = await membersResponse.json();
            setAllMembers(membersData);

            const contributionsResponse = await fetch(`${API_BASE}/member-contributions`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!contributionsResponse.ok) {
                const errorData = await contributionsResponse.json();
                throw new Error(errorData?.message || 'Failed to fetch all member contributions.');
            }
            const contributionsData = await contributionsResponse.json();
            setAllContributions(contributionsData);
            addNotification('All member contributions loaded successfully!', 'success'); 

        } catch (err) {
            addNotification(err.message, 'error'); 
            console.error('Error fetching general contributions data:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllContributionsAndMembers();
    }, [fetchAllContributionsAndMembers]);

    const handleViewSpecificMemberContributions = (memberId) => {
        navigate(`/members/${memberId}/contributions`);
    };

    return (
        <div className="general-contributions-section">
            <h2 className="dashboard-title">All Member Contributions</h2>
            {notifications.map((notif) => (
                <Notification
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    type={notif.type}
                    removeNotification={removeNotification}
                />
            ))}
            {loading && <p className="status red">Loading all contributions...</p>}
            {!loading && allContributions.length === 0 && !notifications.some(n => n.type === 'error') && (
                <div className="warning">
                    No contributions recorded yet.
                </div>
            )}
            {!loading && (
                <GeneralMemberContributionsList
                    contributions={allContributions}
                    members={allMembers}
                    onViewSpecificMemberContributions={handleViewSpecificMemberContributions}
                />
            )}
        </div>
    );
};

export default GeneralMemberContributionsContainer;