import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUpDonateur from './components/SignUpDonateur';
import SignUpChercheur from './components/SignUpChercheur';
import Login from './components/Login';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import SubmitProject from './components/SubmitProject';
import ManageProjects from './components/ManageProjects';
import AdminDashboard from './components/admin/AdminDashboard';
import ProjectDetails from './components/ProjectDetails';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('App component rendered');
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup-donateur" element={<><Navigation /><SignUpDonateur /></>} />
                    <Route path="/signup-chercheur" element={<><Navigation /><SignUpChercheur /></>} />
                    <Route path="/login" element={<><Navigation /><Login /></>} />
                    <Route path="/profile" element={<PrivateRoute><Navigation /><Profile /></PrivateRoute>} />
                    <Route path="/update-profile" element={<><Navigation /><UpdateProfile /></>} />
                    <Route path="/reset-password" element={<><Navigation /><RequestResetPassword /></>} />
                    <Route path="/reset-password/:token" element={<><Navigation /><ResetPassword /></>} />
                    {isAuthenticated && role === 'Chercheur' && (
                        <>
                            <Route path="/submit-project" element={<PrivateRoute><Navigation /><SubmitProject /></PrivateRoute>} />
                            <Route path="/manage-projects" element={<PrivateRoute><Navigation /><ManageProjects /></PrivateRoute>} />
                        </>
                    )}
                    {isAuthenticated && role === 'Admin' && (
                        <>
                            <Route path="/admin-dashboard" element={<PrivateRoute><Navigation /><AdminDashboard /></PrivateRoute>} />
                        </>
                    )}
                    {isAuthenticated && <Route path="/profile" element={<PrivateRoute><Navigation /><Profile /></PrivateRoute>} />}
                    {!isAuthenticated && <Route path="/profile" element={<Navigate to="/login" />} />}
                    <Route path="/home" element={<Home />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
