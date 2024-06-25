import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SubmitProject.css';

function SubmitProject() {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', budget: '' });
    const [error, setError] = useState('');
    const { title, description, category, budget } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

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
            const res = await axios.post(`${apiUrl}/api/projects/submit`, body, config);
            toast.success('Project submitted successfully');
            setFormData({ title: '', description: '', category: '', budget: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Project submission failed');
            toast.error('Project submission failed');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="submit-project-container">
            <form className="submit-project-form" onSubmit={onSubmit}>
                <h1>Submit Project</h1>
                <input type="text" placeholder="Title" name="title" value={title} onChange={onChange} required />
                <textarea type="text" placeholder="Description" name="description" value={description} onChange={onChange} required />
                <input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required />
                <input type="text" placeholder="Budget" name="budget" value={budget} onChange={onChange} required />
                <button type="submit">Submit</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}

export default SubmitProject;