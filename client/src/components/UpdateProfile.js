import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UpdateProfile() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profileImage: null
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

    const { username, email, profileImage } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onImageChange = e => setFormData({ ...formData, profileImage: e.target.files[0] });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', username);
            formDataToSend.append('email', email);
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.put(`${apiUrl}/api/auth/profile`, formDataToSend, config);
            toast.success('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            toast.error('Update failed');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="update-profile-container">
            <form className="update-profile-form" onSubmit={onSubmit} encType="multipart/form-data">
                <h1>Update Profile</h1>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <input type="file" name="profileImage" onChange={onImageChange} accept="image/*" />
                <button type="submit">Update Profile</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default UpdateProfile;
