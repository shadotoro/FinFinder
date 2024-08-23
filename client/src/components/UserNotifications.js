import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserNotifications.css';

function UserNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/notifications`, config);
                setNotifications(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching notifications');
                toast.error('Error fetching notifications');
                console.error(err.response?.data);
            }
        };

        fetchNotifications();
    }, []);

    const handleReply = async (notificationId) => {
        if (!newReply.trim()) {
            toast.error('Reply cannot be empty');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const body = { text: newReply };
            const res = await axios.post(`${apiUrl}/api/notifications/${notificationId}/reply`, body, config);
            setNotifications(notifications.map(notification =>
                notification._id === notificationId ? res.data : notification
            ));
            setNewReply('');
            toast.success('Reply added successfully');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error sending reply');
            toast.error('Error sending reply');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="notifications-container">
            <h1>Your Notifications</h1>
            {error && <p className="error">{error}</p>}
            <ul className="notifications-list">
                {notifications.map(notification => (
                    <li key={notification._id} className="notification-item">
                        <p>{notification.message}</p>
                        <ul className="replies-list">
                            {notification.replies.map(reply => (
                                <li key={reply._id} className="reply-item">
                                    <strong>{reply.user.username}:</strong> {reply.text} <em>on {new Date(reply.date).toLocaleString()}</em>
                                </li>
                            ))}
                        </ul>
                        <div className="reply-form">
                            <input
                                type="text"
                                placeholder="Write a reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <button onClick={() => handleReply(notification._id)}>Send</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserNotifications;
