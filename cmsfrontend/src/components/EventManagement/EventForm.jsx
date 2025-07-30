import React, { useState, useEffect } from 'react';

const initialFormState = {
    eventId: null,
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventDescription: '',
    organizerId: '',
    organizerName: '',
};

const EventForm = ({ onSubmit, editingEvent, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingEvent) {
            const formattedDate = editingEvent.eventDate ? new Date(editingEvent.eventDate).toISOString().split('T')[0] : '';
            setFormData({
                ...editingEvent,
                eventDate: formattedDate,
                organizerId: editingEvent.organizerId || '',
                organizerName: editingEvent.organizerName || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editingEvent]);

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

        if (!formData.eventName.trim()) {
            newErrors.eventName = 'Event Name is required';
            isValid = false;
        }
        if (!formData.eventDate) {
            newErrors.eventDate = 'Event Date is required';
            isValid = false;
        }
        if (!formData.eventTime) {
            newErrors.eventTime = 'Event Time is required';
            isValid = false;
        }
        if (!formData.eventLocation.trim()) {
            newErrors.eventLocation = 'Event Location is required';
            isValid = false;
        }
        if (!formData.eventDescription.trim()) {
            newErrors.eventDescription = 'Event Description is required';
            isValid = false;
        }
        if (!formData.organizerName.trim()) {
            newErrors.organizerName = 'Organizer Name is required';
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
            <h2 className="dashboard-title">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventName">Event Name:</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        className={`form-input ${errors.eventName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.eventName && <p className="error">{errors.eventName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="eventDate">Date:</label>
                    <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className={`form-input ${errors.eventDate ? 'input-error' : ''}`}
                        required
                    />
                    {errors.eventDate && <p className="error">{errors.eventDate}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="eventTime">Time:</label>
                    <input
                        type="time"
                        id="eventTime"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                        className={`form-input ${errors.eventTime ? 'input-error' : ''}`}
                        required
                    />
                    {errors.eventTime && <p className="error">{errors.eventTime}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="eventLocation">Location:</label>
                    <input
                        type="text"
                        id="eventLocation"
                        name="eventLocation"
                        value={formData.eventLocation}
                        onChange={handleChange}
                        className={`form-input ${errors.eventLocation ? 'input-error' : ''}`}
                        required
                    />
                    {errors.eventLocation && <p className="error">{errors.eventLocation}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="eventDescription">Description:</label>
                    <textarea
                        id="eventDescription"
                        name="eventDescription"
                        value={formData.eventDescription}
                        onChange={handleChange}
                        className={`form-input ${errors.eventDescription ? 'input-error' : ''}`}
                        rows="3"
                        required
                    />
                    {errors.eventDescription && <p className="error">{errors.eventDescription}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="organizerId">Organizer ID (Optional):</label>
                    <input
                        type="number"
                        id="organizerId"
                        name="organizerId"
                        value={formData.organizerId}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="organizerName">Organizer Name:</label>
                    <input
                        type="text"
                        id="organizerName"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={handleChange}
                        className={`form-input ${errors.organizerName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.organizerName && <p className="error">{errors.organizerName}</p>}
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
                        {isEditing ? 'Update Event' : 'Add Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
