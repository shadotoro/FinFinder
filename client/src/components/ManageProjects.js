import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageProjects.css';

function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/projects/my-projects`, config);
                setProjects(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching projects');
                toast.error('Error fetching projects');
                console.error(err.response?.data);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="manage-projects-container">
            <h1>Manage Projects</h1>
            {error && <p className="error">{error}</p>}
            <ul className="projects-list">
                {projects.map(project => (
                    <li key={project._id} className="project-item">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <p>Status: {project.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageProjects;