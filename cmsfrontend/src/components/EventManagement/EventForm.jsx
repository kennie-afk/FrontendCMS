import React, { useState, useEffect } from 'react';

const initialFormState = {
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
};

const EventForm = ({ onSubmit, editingEvent }) => {
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingEvent) {
            setFormData(editingEvent);
        } else {
            setFormData(initialFormState);
        }
    }, [editingEvent]);

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
            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />

                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />

                <label>Time:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="form-input" />

                <label>Location:</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" />

                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" />

                <button type="submit">{editingEvent ? 'Update Event' : 'Add Event'}</button>
            </form>
        </div>
    );
};

export default EventForm;