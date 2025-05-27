import React, { useState, useEffect } from 'react';

const initialFormState = {
    id: '',
    title: '',
    speaker: '',
    date: '',
    url: '',
    description: '',
};

const SermonForm = ({ onSubmit, editingSermon }) => {
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingSermon) {
            setFormData(editingSermon);
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
        setFormData(initialFormState);
    };

    return (
        <div className="registration-form"> 
            <h2>{editingSermon ? 'Edit Sermon' : 'Add New Sermon'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
                <label>Speaker:</label>
                <input type="text" name="speaker" value={formData.speaker} onChange={handleChange} required className="form-input" />
                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                <label>Video/Audio URL:</label>
                <input type="url" name="url" value={formData.url} onChange={handleChange} className="form-input" />
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" />
                <button type="submit">{editingSermon ? 'Update Sermon' : 'Add Sermon'}</button>
            </form>
        </div>
    );
};

export default SermonForm;