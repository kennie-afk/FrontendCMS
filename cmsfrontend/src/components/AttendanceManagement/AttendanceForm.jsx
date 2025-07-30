import React, { useState, useEffect } from 'react';

const initialFormState = {
    attendanceId: null,
    memberId: '',
    memberName: '',
    attendanceDate: '',
    status: '',
    comments: '',
};

const AttendanceForm = ({ onSubmit, editingRecord, onCancel, allMembers }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingRecord) {
            const formattedDate = editingRecord.attendanceDate ? new Date(editingRecord.attendanceDate).toISOString().split('T')[0] : '';
            setFormData({
                ...editingRecord,
                attendanceDate: formattedDate,
            });
        } else {
            setFormData({
                ...initialFormState,
                attendanceDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleMemberChange = (e) => {
        const memberId = e.target.value;
        const selectedMember = allMembers.find(m => String(m.memberId) === String(memberId));
        setFormData((prev) => ({
            ...prev,
            memberId: memberId,
            memberName: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : '',
        }));
        if (errors.memberId) {
            setErrors((prevErrors) => ({ ...prevErrors, memberId: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.memberId) {
            newErrors.memberId = 'Member is required.';
            isValid = false;
        }
        if (!formData.attendanceDate) {
            newErrors.attendanceDate = 'Date is required.';
            isValid = false;
        }
        if (!formData.status) {
            newErrors.status = 'Status is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                ...(formData.attendanceId && { attendanceId: formData.attendanceId }),
                memberId: parseInt(formData.memberId),
                memberName: formData.memberName,
                attendanceDate: formData.attendanceDate,
                status: formData.status,
                comments: formData.comments,
            };
            onSubmit(dataToSubmit);
        }
    };

    const isEditing = !!editingRecord?.attendanceId;

    return (
        <div className="registration-form">
            <h2 className="dashboard-title">{isEditing ? 'Edit Attendance Record' : 'Add New Attendance Record'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="memberId">Member:</label>
                    <select
                        id="memberId"
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleMemberChange}
                        className={`form-input ${errors.memberId ? 'input-error' : ''}`}
                        required
                        disabled={isEditing}
                    >
                        <option value="">Select a Member</option>
                        {allMembers.map((member) => (
                            <option key={member.memberId} value={member.memberId}>
                                {member.firstName} {member.lastName}
                            </option>
                        ))}
                    </select>
                    {errors.memberId && <p className="error">{errors.memberId}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="attendanceDate">Date:</label>
                    <input
                        type="date"
                        id="attendanceDate"
                        name="attendanceDate"
                        value={formData.attendanceDate}
                        onChange={handleChange}
                        className={`form-input ${errors.attendanceDate ? 'input-error' : ''}`}
                        required
                    />
                    {errors.attendanceDate && <p className="error">{errors.attendanceDate}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`form-input ${errors.status ? 'input-error' : ''}`}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                    </select>
                    {errors.status && <p className="error">{errors.status}</p>}
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
                        {isEditing ? 'Update Record' : 'Add Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AttendanceForm;
