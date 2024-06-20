import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState(''); // stocke le new mdp
    const [error, setError] = useState(''); // gére les erreurs
    const { token } = useParams(); // récupère le token depuis les paramètres de l'URL

    const onChange = e => setPassword(e.target.value); // gestion des changements dans le form
    // gère la soumission du form de réinitilisation
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ password, token });
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            // request POST pour réinitialiser 
            const res = await axios.post(`${apiUrl}/api/auth/reset/${token}`, body, config);
            console.log(res.data);
            toast.success('Password reset successfully');
        } catch (err) {
            // gére les erreurs
            setError(err.response?.data?.message || 'Reset failed');
            toast.error('Reset failed');
            console.error(err.response?.data);
        }
    };
    // rendu du composant
    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={onSubmit}>
                <h1>Reset Password</h1>
                <input type="password" placeholder="Enter new Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Reset Password</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;