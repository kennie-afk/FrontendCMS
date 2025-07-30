import React, { useState, useEffect } from 'react';

const initialFormState = {
    sermonId: null,
    title: '',
    theme: '',
    sermonDate: '',
    videoUrl: '',
    preacherId: '',
    preacherName: '',
};

const SermonForm = ({ onSubmit, editingSermon, onCancel }) => {
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingSermon) {
            const formattedDate = editingSermon.sermonDate ? new Date(editingSermon.sermonDate).toISOString().split('T')[0] : '';
            setFormData({
                ...editingSermon,
                sermonDate: formattedDate,
                preacherId: editingSermon.preacherId || '',
                preacherName: editingSermon.preacherName || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editingSermon]);

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
            <h2 className="dashboard-title">{editingSermon ? 'Edit Sermon' : 'Add New Sermon'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="theme">Theme:</label>
                    <input type="text" id="theme" name="theme" value={formData.theme} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="sermonDate">Sermon Date:</label>
                    <input type="date" id="sermonDate" name="sermonDate" value={formData.sermonDate} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="videoUrl">Video URL:</label>
                    <input type="url" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="preacherId">Preacher ID:</label>
                    <input type="number" id="preacherId" name="preacherId" value={formData.preacherId} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="preacherName">Preacher Name:</label>
                    <input type="text" id="preacherName" name="preacherName" value={formData.preacherName} onChange={handleChange} required className="form-input" />
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
                        {editingSermon ? 'Update Sermon' : 'Add Sermon'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SermonForm;
