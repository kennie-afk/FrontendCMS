import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Notification = ({ message, type, id, removeNotification }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, removeNotification]);

    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;
    const notificationClass = `notification ${type}`;

    return (
        <div className={notificationClass}>
            {icon}
            <span>{message}</span>
        </div>
    );
};

export default Notification;