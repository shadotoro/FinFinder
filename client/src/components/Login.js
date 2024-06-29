import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ email, password });
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.post(`${apiUrl}/api/auth/login`, body, config);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            toast.success('Login successful');

            if (res.data.user.role === 'Admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/profile');
            }
        } catch (err) {
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

export default Login;
