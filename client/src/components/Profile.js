import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/users/profile`, config);
                setUser(res.data);
                setFormData({ username: res.data.username, email: res.data.email });
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching profile');
                console.error(err.response?.data);
            }
        };
        fetchUserProfile();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const body = JSON.stringify(formData);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.put(`${apiUrl}/api/auth/profile`, body, config);
            setMessage(res.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'Update failed');
            console.error(err.response?.data);
        }
    };

    const onDelete = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.delete(`${apiUrl}/api/auth/profile`, config);
            setMessage(res.data.msg);
            localStorage.removeItem('token');
        } catch (err) {
            setError(err.response?.data?.msg || 'Delete failed');
            console.error(err.response?.data);
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <form className="profile-form" onSubmit={onSubmit}>
                <input type="text" placeholder="Username" name="username" value={formData.username} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required />
                <button type="submit">Update Profile</button>
            </form>
            {message && <p className="message">{message}</p>}
            <button onClick={onDelete} className="delete-button">Delete Account</button>
        </div>
    );
}

export default Profile;
