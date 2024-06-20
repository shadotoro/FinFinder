import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function RequestResetPassword() {
    const [email, setEmail] = useState(''); // stocke l'email de l'utilisateur
    const [error, setError] = useState(''); // gére les erreurs

    const onChange = e => setEmail(e.target.value); // gestion des changements dans le champ de formulaire 
    // gestion de la soumission du form de demande de réinitialisation de mdp
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ email });
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            // request POST pour envoyer l'email de récupération
            const res = await axios.post(`${apiUrl}/api/auth/reset-password`, body, config);
            console.log(res.data);
            toast.success('Recovery email sent');
        } catch (err) {
            // gére les erreurs lors de l'envoir de l'email de récup
            setError(err.response?.data?.message || 'Password recovery failed');
            toast.error('Request failed');
            console.error(err.response?.data);
        }
    };
    // rendu du composant RequestResetPassword
    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={onSubmit}>
                <h1>Reset Password</h1>
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <button type="submit">Send Recovery Email</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default RequestResetPassword;