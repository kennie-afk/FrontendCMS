import React, { useState, useEffect } from 'react';

const initialFormState = {
    memberId: null,
    familyId: '',
    departmentId: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    city: '',
    postalCode: '',
    baptismStatus: false,
    baptismDate: '',
    joinedDate: '',
    occupation: '',
    roleInChurch: '',
    profilePictureUrl: '',
};

const MemberRegistration = ({ onSubmit, initialData, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
                baptismDate: initialData.baptismDate ? new Date(initialData.baptismDate).toISOString().split('T')[0] : '',
                joinedDate: initialData.joinedDate ? new Date(initialData.joinedDate).toISOString().split('T')[0] : '',
                baptismStatus: initialData.baptismStatus || false,
                familyId: initialData.familyId || '',
                departmentId: initialData.departmentId || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
            isValid = false;
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
        }
        if (!formData.joinedDate) {
            newErrors.joinedDate = 'Joined Date is required';
            isValid = false;
        }
        if (formData.baptismStatus && !formData.baptismDate) {
            newErrors.baptismDate = 'Baptism Date is required if baptized';
            isValid = false;
        }
        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
            isValid = false;
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of Birth is required';
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
            <h2 className="dashboard-title">{isEditing ? 'Edit Member' : 'Register New Member'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                        required
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`form-input ${errors.gender ? 'input-error' : ''}`}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="error">{errors.gender}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-input ${errors.dateOfBirth ? 'input-error' : ''}`}
                        required
                    />
                    {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="maritalStatus">Marital Status:</label>
                    <input
                        type="text"
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
                        required
                    />
                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-input ${errors.address ? 'input-error' : ''}`}
                        required
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="postalCode">Postal Code:</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="baptismStatus">Baptism Status:</label>
                    <input
                        type="checkbox"
                        id="baptismStatus"
                        name="baptismStatus"
                        checked={formData.baptismStatus}
                        onChange={handleChange}
                        className="form-checkbox"
                    />
                </div>
                {formData.baptismStatus && (
                    <div className="form-group">
                        <label htmlFor="baptismDate">Baptism Date:</label>
                        <input
                            type="date"
                            id="baptismDate"
                            name="baptismDate"
                            value={formData.baptismDate}
                            onChange={handleChange}
                            className={`form-input ${errors.baptismDate ? 'input-error' : ''}`}
                            required={formData.baptismStatus}
                        />
                        {errors.baptismDate && <p className="error">{errors.baptismDate}</p>}
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="joinedDate">Joined Date:</label>
                    <input
                        type="date"
                        id="joinedDate"
                        name="joinedDate"
                        value={formData.joinedDate}
                        onChange={handleChange}
                        className={`form-input ${errors.joinedDate ? 'input-error' : ''}`}
                        required
                    />
                    {errors.joinedDate && <p className="error">{errors.joinedDate}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="occupation">Occupation:</label>
                    <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roleInChurch">Role in Church:</label>
                    <input
                        type="text"
                        id="roleInChurch"
                        name="roleInChurch"
                        value={formData.roleInChurch}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={formData.profilePictureUrl}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="familyId">Family ID (Optional):</label>
                    <input
                        type="number"
                        id="familyId"
                        name="familyId"
                        value={formData.familyId}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="departmentId">Department ID (Optional):</label>
                    <input
                        type="number"
                        id="departmentId"
                        name="departmentId"
                        value={formData.departmentId}
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
                        {isEditing ? 'Update Member' : 'Register Member'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemberRegistration;