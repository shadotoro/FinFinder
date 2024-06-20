import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SignUp() {
    // stocke les données du form d'inscription
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState(''); // gére les erreurs

    const { username, password, email } = formData;
    // gestion des changements dans le form
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    // gestion de la soumission du form
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ username, password, email });
            const apiUrl = process.env.REACT_APP_API_URL;
            // request POST pour l'inscription
            const res = await axios.post(`${apiUrl}/api/auth/signup`, body, config);
            console.log(res.data);
            toast.success('Registration successful');
        } catch (err) {
            // gére les erreurs 
            setError(err.response?.data?.message || 'Registration failed');
            toast.error('Registration failed');
            console.error(err.response?.data);
        }
    };
    // rendu du composant
    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={onSubmit}>
                <h1>Sign Up</h1>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Enter Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Sign Up</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default SignUp;
