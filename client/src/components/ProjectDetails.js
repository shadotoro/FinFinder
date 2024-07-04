import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../components/ProjectDetails.css';


function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Project ID:', id);
        const fetchProject = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching project');
                console.error(err.response?.data);
            }
        };
        fetchProject();
    }, [id]);

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const body = { amount, projectId: id };
            await axios.post(`${apiUrl}/api/projects/donate`, body, config);
            toast.success('Donation successful');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error processing donation');
            toast.error(err.response?.data?.msg || 'Error processing donation');
            console.error(err.response?.data);
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="project-details-container">
            <h1>{project.title}</h1>
            <img src={`http://localhost:3001/${project.image}`} alt={project.title} />
            console.log(project.image);
            <p>{project.description}</p>
            <p>Category: {project.category}</p>
            <p>Budget: {project.budget}</p>
            <form onSubmit={handleDonate}>
                <input
                    type="number"
                    placeholder="Donation Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <button type="submit">Donate</button>
            </form>
        </div>
    );
}

export default ProjectDetails;
