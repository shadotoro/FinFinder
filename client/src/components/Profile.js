import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null); // State pour stocker les informations de l'utilisateur
    const [formData, setFormData] = useState({ username: '', email: '' }); // State pour gérer les données du formulaire
    const [error, setError] = useState(''); // State pour gérer les erreurs
    const [message, setMessage] = useState(''); // State pour afficher des messages

    useEffect(() => { // useEffect pour récupérer les informations de profil de l'utilisateur lors du montage du composant
        const fetchUserProfile = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/users/profile`, config); // Requête GET pour récupérer les informations de l'utilisateur
                // Met à jour les states user et formData avec les données récupérées
                setUser(res.data);
                setFormData({ username: res.data.username, email: res.data.email, profileImage: res.data.profileImage || '' });
                toast.success('Profile fetched successfully');
            } catch (err) {
                // Gère les erreurs lors de la récupération du profil
                setError(err.response?.data?.msg || 'Error fetching profile');
                toast.error('Error fetching profile');
                console.error(err.response?.data);
            }
        };
        fetchUserProfile();
    }, []);
    // Gestion des changements dans les champs de formulaire
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    // Gestion du changement de l'image de profil
    const onImageChange = e => setFormData({ ...formData, profileImage: e.target.files[0] });
    // Gestion de la soumission du formulaire de mise à jour du profil
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            if (formData.profileImage) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            // Requête PUT pour mettre à jour le profil
            const res = await axios.put(`${apiUrl}/api/auth/profile`, formDataToSend, config);
            // Met à jour le message avec la réponse de l'API
            setMessage(res.data.msg);
            // Met à jour le profil utilisateur localement
            setUser({ ...user, profileImage: res.data.profileImage });
        } catch (err) {
            // Gère les erreurs lors de la mise à jour du profil
            setError(err.response?.data?.msg || 'Update failed');
            console.error(err.response?.data);
        }
    };
    // Gestion de la suppression du compte
    const onDelete = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            // Requête DELETE pour supprimer le compte
            const res = await axios.delete(`${apiUrl}/api/auth/profile`, config);
            // Met à jour le message avec la réponse de l'API
            setMessage(res.data.msg);
            // Supprime le token de l'utilisateur
            localStorage.removeItem('token');
        } catch (err) {
            // Gère les erreurs lors de la suppression du compte
            setError(err.response?.data?.msg || 'Delete failed');
            console.error(err.response?.data);
        }
    };
    // Affiche un message en cas d'erreur
    if (error) {
        return <div className="error">{error}</div>;
    }
    // Affiche un message de chargement si les données de l'utilisateur ne sont pas encore chargées
    if (!user) {
        return <div>Loading...</div>;
    }
    // Affiche le composant Profile
    return (
        <div className="profile-container">
            <form className="profile-form" onSubmit={onSubmit}>
                <h1>Profile</h1>
                <div className="profile-header">
                    <img src={user.profileImage ? `http://localhost:3001/${user.profileImage}` : 'default-profile.png'} alt="Profile" className="profile-image" />
                    <input type="file" name="profileImage" onChange={onImageChange} accept="image/*" />
                </div>
                <input type="text" placeholder="Username" name="username" value={formData.username} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required />
                <button type="submit">Update Profile</button>
            </form>
            <div className="profile-stats">
                <h2>Stats</h2>
                <p>Date d'inscription : {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Projets financés : {user.projectsFunded.length}</p>
                <p>Projets soumis : {user.projectsSubmitted.length}</p>
            </div>
            <button onClick={onDelete} className="delete-button">Delete Account</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Profile;
