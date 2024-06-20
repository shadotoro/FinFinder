import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
    const [user, setUser] = useState(null); // state pour stocker les infos de l'utilisateur
    const [formData, setFormData] = useState({ username: '', email: '' });  //gére les données du form
    const [error, setError] = useState('');  // gére les erreurs
    const [message, setMessage] = useState('');  // affiche des msgs

    useEffect(() => { // useEffect récupére les infos de profil de l'utilisateur lors du montage du composant
        const fetchUserProfile = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/users/profile`, config); // requête GET pour récupérer les infos de l'utilisateur
                // Met à jour les states user et formData avec les données récupérées
                setUser(res.data);
                setFormData({ username: res.data.username, email: res.data.email });
                toast.success('Profile fetched successfully');
            } catch (err) {
                //gére les erreurs lors de la récupération du profil
                setError(err.response?.data?.msg || 'Error fetching profile');
                toast.error('Error fetching profile');
                console.error(err.response?.data);
            }
        };
        fetchUserProfile();
    }, []);
    // Gestion des changements dans les champs de formulaire
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    // Gestion de la soumission du form de mise à jour du profil
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
            // requête PUT pour mettre à jour le profil
            const res = await axios.put(`${apiUrl}/api/auth/profile`, body, config);
            // met à jour le msg avec la réponse de l'API
            setMessage(res.data.msg);
        } catch (err) {
            // gére les erreurs lors de la mise à jour du profil
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
            // requête DELETE pour supprimer le compte
            const res = await axios.delete(`${apiUrl}/api/auth/profile`, config);
            // met à jour le msg avec la réponse de l'API
            setMessage(res.data.msg);
            // supprime le token de l'utilisateur
            localStorage.removeItem('token');
        } catch (err) {
            // gére les erreurs lors de la suppression du compte
            setError(err.response?.data?.msg || 'Delete failed');
            console.error(err.response?.data);
        }
    };
    // affiche un msg en cas d'erreur
    if (error) {
        return <div className="error">{error}</div>;
    }
    // affiche un msg de chargement si les données de l'utilisateur ne sont pas encore chargées
    if (!user) {
        return <div>Loading...</div>;
    }
    // affiche le composant Profile
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
