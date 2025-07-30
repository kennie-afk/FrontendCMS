import React, { useState, useEffect } from 'react';

const initialFormState = {
    familyId: null,
    familyName: '',
    headOfFamilyId: '',
    headOfFamilyName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
};

const FamilyForm = ({ onSubmit, editingFamily, onCancel, allMembers }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingFamily) {
            setFormData({
                ...editingFamily,
                headOfFamilyId: editingFamily.headOfFamilyId || '',
                headOfFamilyName: editingFamily.headOfFamilyName || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [editingFamily]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleHeadOfFamilyChange = (e) => {
        const memberId = e.target.value;
        const selectedMember = allMembers.find(m => String(m.memberId) === String(memberId));
        setFormData((prev) => ({
            ...prev,
            headOfFamilyId: memberId,
            headOfFamilyName: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : '',
        }));
        if (errors.headOfFamilyId) {
            setErrors((prevErrors) => ({ ...prevErrors, headOfFamilyId: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.familyName.trim()) {
            newErrors.familyName = 'Family Name is required.';
            isValid = false;
        }
        if (!formData.headOfFamilyId) {
            newErrors.headOfFamilyId = 'Head of Family is required.';
            isValid = false;
        }
        // Basic email validation
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Invalid email address.';
            isValid = false;
        }
        // Basic phone number validation (optional, can be more robust)
        if (formData.contactPhone && !/^\+?\d{10,15}$/.test(formData.contactPhone)) {
            newErrors.contactPhone = 'Invalid phone number format.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                ...(formData.familyId && { familyId: formData.familyId }),
                familyName: formData.familyName,
                headOfFamilyId: parseInt(formData.headOfFamilyId),
                headOfFamilyName: formData.headOfFamilyName,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                address: formData.address,
            };
            onSubmit(dataToSubmit);
        }
    };

    const isEditing = !!editingFamily?.familyId;

    return (
        <div className="registration-form">
            <h2 className="dashboard-title">{isEditing ? 'Edit Family' : 'Add New Family'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="familyName">Family Name:</label>
                    <input
                        type="text"
                        id="familyName"
                        name="familyName"
                        value={formData.familyName}
                        onChange={handleChange}
                        className={`form-input ${errors.familyName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.familyName && <p className="error">{errors.familyName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="headOfFamilyId">Head of Family:</label>
                    <select
                        id="headOfFamilyId"
                        name="headOfFamilyId"
                        value={formData.headOfFamilyId}
                        onChange={handleHeadOfFamilyChange}
                        className={`form-input ${errors.headOfFamilyId ? 'input-error' : ''}`}
                        required
                    >
                        <option value="">Select Head of Family</option>
                        {allMembers.map((member) => (
                            <option key={member.memberId} value={member.memberId}>
                                {member.firstName} {member.lastName}
                            </option>
                        ))}
                    </select>
                    {errors.headOfFamilyId && <p className="error">{errors.headOfFamilyId}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email:</label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className={`form-input ${errors.contactEmail ? 'input-error' : ''}`}
                    />
                    {errors.contactEmail && <p className="error">{errors.contactEmail}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="contactPhone">Contact Phone:</label>
                    <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className={`form-input ${errors.contactPhone ? 'input-error' : ''}`}
                    />
                    {errors.contactPhone && <p className="error">{errors.contactPhone}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                        rows="3"
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
                        {isEditing ? 'Update Family' : 'Add Family'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FamilyForm;
