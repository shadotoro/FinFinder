import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SubmitProject.css';

function SubmitProject() {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', budget: '', image: '' });
    const [error, setError] = useState('');
    const { title, description, category, budget, image } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onImageChange = e => setFormData({ ...formData, image: e.target.files[0] });

    const onSubmit = async e => {
            e.preventDefault();
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const formDataToSend = new FormData();
            formDataToSend.append('title', title);
            formDataToSend.append('description', description);
            formDataToSend.append('category', category);
            formDataToSend.append('budget', budget);
            formDataToSend.append('image', image);
            
            try {
                const res = await axios.post('http://localhost:3001/api/projects', formDataToSend, config);
            toast.success('Project submitted successfully');
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
                <input type="file" name="image" onChange={onImageChange} required />
                <button type="submit">Submit</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}

export default SubmitProject;