import React, { useState, useEffect } from 'react';

const initialFormState = {
    id: null,
    title: '',
    message: '',
    announcementType: '',
    dateCreated: '',
    effectiveDate: '',
    effectiveUntil: '',
    targetAudience: '',
};

const AnnouncementForm = ({ onSubmit, editingAnnouncement, onCancel }) => {
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingAnnouncement) {
            setFormData({
                ...editingAnnouncement,
                dateCreated: editingAnnouncement.dateCreated ? new Date(editingAnnouncement.dateCreated).toISOString().split('T')[0] : '',
                effectiveDate: editingAnnouncement.effectiveDate ? new Date(editingAnnouncement.effectiveDate).toISOString().split('T')[0] : '',
                effectiveUntil: editingAnnouncement.effectiveUntil ? new Date(editingAnnouncement.effectiveUntil).toISOString().split('T')[0] : '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editingAnnouncement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="registration-form">
            <h2>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>Message:</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    rows="4"
                />

                <label>Announcement Type:</label>
                <select
                    name="announcementType"
                    value={formData.announcementType}
                    onChange={handleChange}
                    required
                    className="form-input"
                >
                    <option value="">Select Type</option>
                    <option value="GENERAL">General</option>
                    <option value="EVENT">Event</option>
                    <option value="URGENT">Urgent</option>
                </select>

                <label>Date Created:</label>
                <input
                    type="date"
                    name="dateCreated"
                    value={formData.dateCreated}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>Effective Date:</label>
                <input
                    type="date"
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleChange}
                    className="form-input"
                />

                <label>Effective Until:</label>
                <input
                    type="date"
                    name="effectiveUntil"
                    value={formData.effectiveUntil}
                    onChange={handleChange}
                    className="form-input"
                />

                <label>Target Audience:</label>
                <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="form-input"
                />

                <div className="form-actions">
                    <button type="submit">
                        {editingAnnouncement ? 'Update Announcement' : 'Publish Announcement'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementForm;