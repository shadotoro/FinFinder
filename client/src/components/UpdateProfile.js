import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UpdateProfile() {
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [error, setError] = useState('');

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
                setFormData({ username: res.data.username, email: res.data.email });
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching profile');
                toast.error('Error fetching profile');
                console.error(err.response?.data);
            }
        };
        fetchUserProfile();
    }, []);

    const { username, email } = formData;
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
            const body = JSON.stringify({ username, email });
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.put(`${apiUrl}/api/auth/profile`, body, config);
            console.log(res.data);
            toast.success('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            toast.error('Update failed');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="update-profile-container">
            <form className="update-profile-form" onSubmit={onSubmit}>
                <h1>Update Profile</h1>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <button type="submit">Update Profile</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default UpdateProfile;
