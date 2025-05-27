import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TithesOfferingsForm = ({
    onSubmit,
    initialData,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        amount: '',
        dateOfContribution: initialData?.dateOfContribution ? new Date(initialData.dateOfContribution) : new Date(),
        ...initialData,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                dateOfContribution: initialData.dateOfContribution ? new Date(initialData.dateOfContribution) : new Date(),
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setFormData({ ...formData, dateOfContribution: dateValue ? new Date(dateValue) : null });
        if (errors.dateOfContribution) {
            setErrors(prevErrors => ({ ...prevErrors, dateOfContribution: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.amount.trim() || isNaN(Number(formData.amount))) {
            newErrors.amount = 'Amount is required and must be a number';
            isValid = false;
        } else if (Number(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than zero';
            isValid = false;
        }
        if (!formData.dateOfContribution) {
            newErrors.dateOfContribution = 'Date of Contribution is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                id: formData.id,
                amount: Number(formData.amount),
                dateOfContribution: formData.dateOfContribution ? format(formData.dateOfContribution, 'yyyy-MM-dd') : ''
            };
            onSubmit(dataToSubmit);
        }
    };

    return (
        <div className="registration-form">
            <h2 className="dashboard-title">
                {initialData?.id ? 'Edit Tithe/Offering' : 'Add Tithe/Offering'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`form-input ${errors.amount ? 'input-error' : ''}`}
                        required
                    />
                    {errors.amount && <p className="error">{errors.amount}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfContribution">Date of Contribution:</label>
                    <input
                        type="date"
                        id="dateOfContribution"
                        name="dateOfContribution"
                        value={formData.dateOfContribution ? format(formData.dateOfContribution, 'yyyy-MM-dd') : ''}
                        onChange={handleDateChange}
                        className={`form-input ${errors.dateOfContribution ? 'input-error' : ''}`}
                        required
                    />
                    {errors.dateOfContribution && <p className="error">{errors.dateOfContribution}</p>}
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
                        {initialData?.id ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TithesOfferingsForm;