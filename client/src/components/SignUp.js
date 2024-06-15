import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');

    const { username, password, email } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const res = await axios.post(`${apiUrl}/api/auth/signup`, body, config);
            console.log(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err.response?.data);
        }
    };
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
