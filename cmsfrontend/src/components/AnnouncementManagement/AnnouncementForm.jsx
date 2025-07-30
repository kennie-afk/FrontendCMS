import React, { useState, useEffect } from 'react';

const initialFormState = {
    announcementId: null,
    title: '',
    message: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
};

const AnnouncementForm = ({ onSubmit, editingAnnouncement, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingAnnouncement) {
            setFormData({
                ...editingAnnouncement,
                announcementId: editingAnnouncement.announcementId,
                startDate: editingAnnouncement.startDate ? new Date(editingAnnouncement.startDate).toISOString().split('T')[0] : '',
                endDate: editingAnnouncement.endDate ? new Date(editingAnnouncement.endDate).toISOString().split('T')[0] : '',
                status: editingAnnouncement.status || 'DRAFT',
            });
        } else {
            setFormData({
                ...initialFormState,
                startDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [editingAnnouncement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Start Date is required';
            isValid = false;
        }
        if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'End Date cannot be before Start Date';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="registration-form">
            <h2 className="dashboard-title">{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`form-input ${errors.title ? 'input-error' : ''}`}
                        required
                    />
                    {errors.title && <p className="error">{errors.title}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`form-input ${errors.message ? 'input-error' : ''}`}
                        rows="4"
                        required
                    ></textarea>
                    {errors.message && <p className="error">{errors.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>

                {editingAnnouncement && editingAnnouncement.createdAt && (
                    <div className="form-group">
                        <label htmlFor="createdAt">Date Created:</label>
                        <input
                            type="text"
                            id="createdAt"
                            name="createdAt"
                            value={new Date(editingAnnouncement.createdAt).toLocaleDateString() + ' ' + new Date(editingAnnouncement.createdAt).toLocaleTimeString()}
                            readOnly
                            className="form-input"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="startDate">Start Date (Effective From):</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`form-input ${errors.startDate ? 'input-error' : ''}`}
                        required
                    />
                    {errors.startDate && <p className="error">{errors.startDate}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End Date (Effective Until):</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`form-input ${errors.endDate ? 'input-error' : ''}`}
                    />
                    {errors.endDate && <p className="error">{errors.endDate}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience">Target Audience:</label>
                    <input
                        type="text"
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., All Members, Youth Group, Leaders"
                    />
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-btn"
                    >
                        {isEditing ? 'Update Announcement' : 'Publish Announcement'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementForm;
