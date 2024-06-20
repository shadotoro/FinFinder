import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UpdateProfile() {
    // State pour stocker les données du formulaire de mise à jour du profil
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [error, setError] = useState(''); // State pour gérer les erreurs
    // useEffect pour récupérer les informations du profil utilisateur au chargement du composant
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                // Requête GET pour récupérer les informations du profil
                const res = await axios.get(`${apiUrl}/api/users/profile`, config);
                setFormData({ username: res.data.username, email: res.data.email });
            } catch (err) {
                // Gérer les erreurs lors de la récupération du profil
                setError(err.response?.data?.message || 'Error fetching profile');
                toast.error('Error fetching profile');
                console.error(err.response?.data);
            }
        };
        fetchUserProfile();
    }, []);

    const { username, email } = formData;
    // Gestion des changements dans les champs de formulaire
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    // Gestion de la soumission du formulaire de mise à jour du profil
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
            // Requête PUT pour mettre à jour le profil
            const res = await axios.put(`${apiUrl}/api/auth/profile`, body, config);
            console.log(res.data);
            toast.success('Profile updated successfully');
        } catch (err) {
            // Gérer les erreurs lors de la mise à jour du profil
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
