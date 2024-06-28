import React, { useState } from 'react'; // Importation de React et du hook useState
import axios from 'axios';  // import de la bibli axios pour les requests HTTP
import { toast } from 'react-toastify';  // import de la bibli toastify pour afficher des notifs
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    // définition de l'état initial pour le formulaire de co' et les erreurs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    //déstructuration des valeurs d'email et de password depuis formData
    const { email, password } = formData;

    const navigate = useNavigate();

    // gestionnaire de changement de champ de formulaire
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    // gestionnaire d'envoi du formulaire de co'
    const onSubmit = async e => {
        e.preventDefault(); // empêche le comportement par défaut de soumission du formulaire
        try {
            // configuration des en-têtes de la request HTTP
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            // création du corps de la requête
            const body = JSON.stringify({ email, password });
            // définition de l'URL de l'API
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            // envoi de la requête POST à l'API pour authentification
            const res = await axios.post(`${apiUrl}/api/auth/login`, body, config);
            // enregistrement du token dans le local storage pour authentification future
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            // affichage d'une notification de succès
            toast.success('Login successful');
            navigate('/profile'); // redirection vers la page d'accueil après authentification
        } catch (err) {
            // affichage d'une notification d'erreur s'il y a eu une erreur lors de la requête
            setError(err.response?.data?.msg || 'Login failed');
            toast.error(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={onSubmit}>
                <h1>Login</h1>
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Enter Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login; // Exportation du composant login pour utilisation dans d'autres parties de l'application
