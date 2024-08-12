import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageProjects.css';

function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [editProject, setEditProject] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', category: '', budget: '', image: null });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const res = await axios.get('http://localhost:3001/api/projects/my-projects', config);
                setProjects(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching projects');
                toast.error('Error fetching projects');
                console.error(err.response?.data);
            }
        };
        fetchProjects();
    }, []);

    const handleEdit = (project) => {
        setEditProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            category: project.category,
            budget: project.budget,
            image: null
        });
    };

    const handleDelete = async (projectId) => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            await axios.delete(`http://localhost:3001/api/projects/${projectId}`, config);
            setProjects(projects.filter(project => project._id !== projectId));
            toast.success('Project deleted successfully');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error deleting project');
            toast.error('Error deleting project');
            console.error(err.response?.data);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('budget', formData.budget);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.put(`http://localhost:3001/api/projects/${editProject._id}`, formDataToSend, config);
            setProjects(projects.map(project => (project._id === editProject._id ? res.data : project)));
            setEditProject(null);
            toast.success('Project updated successfully');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error updating project');
            toast.error('Error updating project');
            console.error(err.response?.data);
        }
    };

    const onChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    return (
        <div className="manage-projects-container">
            <h1>Manage Projects</h1>
            {error && <p className="error">{error}</p>}
            <ul className="projects-list">
                {projects.map(project => (
                    <li key={project._id} className="project-item">
                        <h2>{project.title}</h2>
                        <img src={`http://localhost:3001/uploads/${project.image}`} alt={project.title} />
                        <p>{project.description}</p>
                        <p>Category: {project.category}</p>
                        <p>Budget: {project.budget}</p>
                        <button onClick={() => handleEdit(project)}>Edit</button>
                        <button onClick={() => handleDelete(project._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {editProject && (
                <form className="edit-form" onSubmit={handleUpdate}>
                    <h2>Edit Project</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={formData.title || ''}
                        onChange={onChange}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={onChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        value={formData.category || ''}
                        onChange={onChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Budget"
                        name="budget"
                        value={formData.budget || ''}
                        onChange={onChange}
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={onChange}
                    />
                    <button type="submit">Update</button>
                </form>
            )}
        </div>
    );
}

export default ManageProjects;
