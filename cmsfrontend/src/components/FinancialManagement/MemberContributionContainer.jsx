import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import MemberContributionList from './MemberContributionList';
import MemberContributionForm from './MemberContributionForm';
import ConfirmDialog from '../ConfirmDialog'; 
import Notification from '../Notification';
import { v4 as uuidv4 } from 'uuid'; 


const API_BASE = 'http://localhost:9001/api';

const MemberContributionContainer = () => {
    const [contributions, setContributions] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]); 
    const [editingContribution, setEditingContribution] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [contributionToDelete, setContributionToDelete] = useState(null);
    const navigate = useNavigate();
    const { id: memberIdFromUrl } = useParams();

    const addNotification = (message, type) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const fetchAllData = useCallback(async () => {
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
            const allMembersData = await membersResponse.json();
            setAllMembers(allMembersData);

            const contributionsResponse = await fetch(`${API_BASE}/member-contributions`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!contributionsResponse.ok) {
                const errorData = await contributionsResponse.json();
                throw new Error(errorData?.message || 'Failed to fetch member contributions.');
            }
            const allContributionsData = await contributionsResponse.json();

            const filteredContributions = allContributionsData.filter(
                (c) => String(c.memberId) === String(memberIdFromUrl)
            );

            setContributions(filteredContributions);
            addNotification('Member contributions loaded successfully!', 'success'); 

        } catch (err) {
            addNotification(err.message, 'error'); 
            console.error(err);
            navigate('/members'); 
        } finally {
            setLoading(false);
        }
    }, [memberIdFromUrl, navigate]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const currentPathAction = pathParts[pathParts.length - 1];
        const isEditRoute = pathParts[pathParts.length - 2] === 'edit';

        if (isEditRoute && currentPathAction) {
            const contributionToEdit = contributions.find(c => String(c.id) === String(currentPathAction));
            if (contributionToEdit) {
                const member = allMembers.find(m => String(m.id) === String(contributionToEdit.memberId));
                setEditingContribution({
                    ...contributionToEdit,
                    contributorName: member ? member.fullName : 'Unknown Member'
                });
            } else if (!loading && contributions.length > 0) {
                setEditingContribution(null);
                navigate(`/members/${memberIdFromUrl}/contributions`);
            }
        } else {
            setEditingContribution(null);
        }
    }, [contributions, loading, memberIdFromUrl, navigate, allMembers]);

    const handleAddContribution = () => {
        setEditingContribution(null);
        navigate(`/members/${memberIdFromUrl}/contributions/add`);
    };

    const handleEditContribution = (contribution) => {
        const member = allMembers.find(m => String(m.id) === String(contribution.memberId));
        setEditingContribution({
            ...contribution,
            contributorName: member ? member.fullName : 'Unknown Member'
        });
        navigate(`/members/${memberIdFromUrl}/contributions/edit/${contribution.id}`);
    };

    const handleDeleteClick = (idToDelete) => {
        setContributionToDelete(idToDelete);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        if (contributionToDelete) {
            setLoading(true);
            setNotifications([]); 
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_BASE}/member-contributions/${contributionToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || 'Failed to delete member contribution.');
                }
                fetchAllData();
                addNotification('Contribution deleted successfully!', 'success'); 
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
            const url = isUpdate ? `${API_BASE}/member-contributions/${formData.id}` : `${API_BASE}/member-contributions`;
            const method = isUpdate ? 'PUT' : 'POST';

            const member = allMembers.find(m => String(m.id) === String(memberIdFromUrl));
            const submissionData = {
                ...formData,
                memberId: memberIdFromUrl,
                contributorName: member ? member.fullName : 'Unknown Member'
            };
            if (!isUpdate) {
                delete submissionData.id;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `Failed to ${isUpdate ? 'update' : 'add'} member contribution.`);
            }
            fetchAllData();
            addNotification(`Contribution ${isUpdate ? 'updated' : 'added'} successfully!`, 'success'); 
            navigate(`/members/${memberIdFromUrl}/contributions`);
        } catch (err) {
            addNotification(err.message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/members/${memberIdFromUrl}/contributions`);
        setEditingContribution(null);
    };

    const getSelectedMemberName = () => {
        const member = allMembers.find(m => String(m.id) === String(memberIdFromUrl));
        return member ? member.fullName : 'Loading Member...';
    };

    return (
        <div className="member-contributions-section">
            <h2 className="dashboard-title" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                Contributions for {getSelectedMemberName()}
                <button
                    onClick={() => navigate('/members')}
                    className="back-btn"
                    style={{ marginLeft: '1rem', verticalAlign: 'middle' }}
                >
                    Back to Members
                </button>
            </h2>
            {notifications.map((notif) => (
                <Notification
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    type={notif.type}
                    removeNotification={removeNotification}
                />
            ))}
            {loading && <p className="status red">Loading contributions...</p>}

            <Routes>
                <Route
                    path="/"
                    element={
                        <MemberContributionList
                            contributions={contributions}
                            members={allMembers}
                            onEdit={handleEditContribution}
                            onDelete={handleDeleteClick} 
                            onAdd={handleAddContribution}
                        />
                    }
                />
                <Route
                    path="/add"
                    element={
                        <MemberContributionForm
                            onSubmit={handleSaveContribution}
                            onCancel={handleCancel}
                            initialData={{
                                memberId: memberIdFromUrl,
                                contributorName: getSelectedMemberName(),
                                dateOfContribution: new Date().toISOString().split('T')[0]
                            }}
                        />
                    }
                />
                <Route
                    path="/edit/:contributionId"
                    element={
                        editingContribution ? (
                            <MemberContributionForm
                                onSubmit={handleSaveContribution}
                                onCancel={handleCancel}
                                initialData={editingContribution}
                            />
                        ) : (
                            <p className="status-message">Loading contribution details for editing...</p>
                        )
                    }
                />
            </Routes>

            {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this contribution?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default MemberContributionContainer;