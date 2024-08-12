import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/projects/all-projects`, config);
                setProjects(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching projects');
                toast.error('Error fetching projects');
                console.error(err.response?.data);
            }
        };
        fetchProjects();
    }, []);

    const handleValidation = async (projectId, status) => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const res = await axios.put(`${apiUrl}/api/projects/validate-project/${projectId}`, { status }, config);
            setProjects(projects.map(project => project._id === projectId ? { ...project, status } : project));
            toast.success(`Project ${status.toLowerCase()}`);
            navigate('/admin-dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Validation failed');
            toast.error('Validation failed');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="admin-dashboard-container">
            <h1>Admin Dashboard</h1>
            <nav className="admin-nav">
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>
            {error && <p className="error">{error}</p>}
            <ul className="projects-list">
                {projects.map(project => (
                    <li key={project._id} className="project-item">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <p>Status: {project.status}</p>
                        <button onClick={() => handleValidation(project._id, 'Accepted')}>Accept</button>
                        <button onClick={() => handleValidation(project._id, 'Rejected')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
