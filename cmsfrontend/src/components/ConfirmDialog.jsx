import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="confirm-dialog-actions">
                    <button className="confirm-yes" onClick={onConfirm}>Yes</button>
                    <button className="confirm-no" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;