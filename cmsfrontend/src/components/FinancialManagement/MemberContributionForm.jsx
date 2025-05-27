import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const MemberContributionForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        memberId: initialData?.memberId || '',
        contributorName: initialData?.contributorName || '',
        dateOfContribution: initialData?.dateOfContribution ? new Date(initialData.dateOfContribution) : new Date(),
        amount: initialData?.amount || '',
        modeOfPayment: initialData?.modeOfPayment || '',
        comments: initialData?.comments || '',
        id: initialData?.id || undefined,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                dateOfContribution: initialData.dateOfContribution ? new Date(initialData.dateOfContribution) : new Date(),
                id: initialData.id || undefined
            });
        } else {
            setFormData({
                memberId: '',
                contributorName: '',
                dateOfContribution: new Date(),
                amount: '',
                modeOfPayment: '',
                comments: '',
                id: undefined,
            });
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

        if (!formData.memberId) {
            newErrors.memberId = 'Member ID is missing.';
            isValid = false;
        }
        if (!formData.dateOfContribution) {
            newErrors.dateOfContribution = 'Date of Contribution is required';
            isValid = false;
        }
        if (!formData.amount.trim() || isNaN(Number(formData.amount))) {
            newErrors.amount = 'Amount is required and must be a number';
            isValid = false;
        } else if (Number(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than zero';
            isValid = false;
        }
        if (!formData.modeOfPayment.trim()) {
            newErrors.modeOfPayment = 'Mode of Payment is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                ...(formData.id && { id: formData.id }),
                memberId: formData.memberId,
                contributorName: formData.contributorName,
                dateOfContribution: formData.dateOfContribution ? format(formData.dateOfContribution, 'yyyy-MM-dd') : '',
                amount: Number(formData.amount),
                modeOfPayment: formData.modeOfPayment,
                comments: formData.comments,
            };
            onSubmit(dataToSubmit);
        }
    };

    const isEditing = !!initialData?.id;

    return (
        <div className="registration-form">
            <h2 className="dashboard-title">
                {isEditing ? 'Edit Member Contribution' : 'Add Member Contribution'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="memberId">Member ID:</label>
                    <input
                        type="text"
                        id="memberId"
                        name="memberId"
                        value={formData.memberId}
                        className={`form-input ${errors.memberId ? 'input-error' : ''}`}
                        disabled
                        readOnly
                    />
                    {errors.memberId && <p className="error">{errors.memberId}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="contributorName">Member Name:</label>
                    <input
                        type="text"
                        id="contributorName"
                        name="contributorName"
                        value={formData.contributorName}
                        className="form-input"
                        disabled
                        readOnly
                    />
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
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`form-input ${errors.amount ? 'input-error' : ''}`}
                        step="0.01"
                        required
                    />
                    {errors.amount && <p className="error">{errors.amount}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="modeOfPayment">Mode of Payment:</label>
                    <select
                        id="modeOfPayment"
                        name="modeOfPayment"
                        value={formData.modeOfPayment}
                        onChange={handleChange}
                        className={`form-input ${errors.modeOfPayment ? 'input-error' : ''}`}
                        required
                    >
                        <option value="">Select Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="M-Pesa">M-Pesa</option>
                    </select>
                    {errors.modeOfPayment && <p className="error">{errors.modeOfPayment}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="comments">Comments (Optional):</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        className="form-input"
                        rows="3"
                    ></textarea>
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
                        {isEditing ? 'Update' : 'Save'} Contribution
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemberContributionForm;