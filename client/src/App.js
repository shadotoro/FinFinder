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

function App() {
    // Vérifie si l'utilisateur est authentifié en cherchant un jeton dans le stockage local
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('App component rendered');
    return (
        <Router>
            <div className="App">
                {/* Définition des routes pour l'application */}
                <Routes>
                    {/* Redirige vers /profile si l'utilisateur est authentifié, sinon vers /login */}
                    <Route path="/" element={<Home />} />
                    {/* Route pour la page d'inscription */}
                    <Route path="/signup-donateur" element={<><Navigation /><SignUpDonateur /></>} />
                    {/* Route pour la page d'inscription chercheur */}
                    <Route path="/signup-chercheur" element={<><Navigation /><SignUpChercheur /></>} />
                    {/* Route pour la page de connexion */}
                    <Route path="/login" element={<><Navigation /><Login /></>} />
                    {/* Route pour le profil utilisateur, protégée par une route privée */}
                    <Route path="/profile" element={<PrivateRoute><Navigation /><Profile /></PrivateRoute>} />
                    {/* Route pour la mise à jour du profil utilisateur */}
                    <Route path="/update-profile" element={<><Navigation /><UpdateProfile /></>} />
                    {/* Route pour la demande de réinitialisation du mot de passe utilisateur */}
                    <Route path="/reset-password" element={<><Navigation /><RequestResetPassword /></>} />
                    {/* Route pour la réinitialisation du mot de passe utilisateur avec un jeton */}
                    <Route path="/reset-password/:token" element={<><Navigation /><ResetPassword /></>} />
                    {isAuthenticated && role === 'Chercheur' && (
                        <>
                            {/* Route pour la soumission d'un projet*/}
                            <Route path="/submit-project" element={<PrivateRoute><Navigation /><SubmitProject /></PrivateRoute>} />
                            {/* Route pour la gestion des projets*/}
                            <Route path="/manage-projects" element={<PrivateRoute><Navigation /><ManageProjects /></PrivateRoute>} />
                        </>
                    )}
                
                    {/* Route conditionnelle pour afficher le profil si l'utilisateur est authentifié */}
                    {isAuthenticated && <Route path="/profile" element={<Profile />} />}
                    {/* Route conditionnelle pour rediriger vers la page de connexion si non authentifié */}
                    {!isAuthenticated && <Route path="/profile" element={<Navigate to="/login" />} />}
                    {/* Route pour la homepage */}
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
