import React, { useState, useEffect } from 'react';

const initialFormState = {
    departmentId: null,
    name: '',
    description: '',
    createdDate: '',
    leaderId: '',
    leaderFullName: '',
    meetingSchedule: '',
};

const DepartmentRegistration = ({ onSubmit, initialData, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                createdDate: initialData.createdDate ? new Date(initialData.createdDate).toISOString().split('T')[0] : '',
                leaderId: initialData.leaderId || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Department Name is required';
            isValid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }
        if (!formData.createdDate) {
            newErrors.createdDate = 'Created Date is required';
            isValid = false;
        }
        if (!formData.leaderFullName.trim()) {
            newErrors.leaderFullName = 'Leader Full Name is required';
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
            <h2 className="dashboard-title">{isEditing ? 'Edit Department' : 'Create New Department'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Department Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                        required
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-input ${errors.description ? 'input-error' : ''}`}
                        required
                    ></textarea>
                    {errors.description && <p className="error">{errors.description}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="createdDate">Created Date:</label>
                    <input
                        type="date"
                        id="createdDate"
                        name="createdDate"
                        value={formData.createdDate}
                        onChange={handleChange}
                        className={`form-input ${errors.createdDate ? 'input-error' : ''}`}
                        required
                    />
                    {errors.createdDate && <p className="error">{errors.createdDate}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="leaderFullName">Leader Full Name:</label>
                    <input
                        type="text"
                        id="leaderFullName"
                        name="leaderFullName"
                        value={formData.leaderFullName}
                        onChange={handleChange}
                        className={`form-input ${errors.leaderFullName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.leaderFullName && <p className="error">{errors.leaderFullName}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="leaderId">Leader ID (Optional):</label>
                    <input
                        type="number"
                        id="leaderId"
                        name="leaderId"
                        value={formData.leaderId}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="meetingSchedule">Meeting Schedule (e.g., "Every Tuesday, 7 PM"):</label>
                    <input
                        type="text"
                        id="meetingSchedule"
                        name="meetingSchedule"
                        value={formData.meetingSchedule}
                        onChange={handleChange}
                        className="form-input"
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
                        {isEditing ? 'Update Department' : 'Create Department'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentRegistration;
