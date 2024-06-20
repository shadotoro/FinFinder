import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';

function App() {
    // Vérifie si l'utilisateur est authentifié en cherchant un jeton dans le stockage local
    const isAuthenticated = !!localStorage.getItem('token');
    console.log('App component rendered');
    return (
        <Router>
            <div className="App">
                {/* Composant de navigation */}
                <Navigation />
                {/* Définition des routes pour l'application */}
                <Routes>
                    {/* Redirige vers /profile si l'utilisateur est authentifié, sinon vers /login */}
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
                    {/* Route pour la page d'inscription */}
                    <Route path="/signup" element={<SignUp />} />
                    {/* Route pour la page de connexion */}
                    <Route path="/login" element={<Login />} />
                    {/* Route pour le profil utilisateur, protégée par une route privée */}
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    {/* Route pour la mise à jour du profil utilisateur */}
                    <Route path="/update-profile" element={<UpdateProfile />} />
                    {/* Route pour la demande de réinitialisation du mot de passe utilisateur */}
                    <Route path="/reset-password" element={<RequestResetPassword />} />
                    {/* Route pour la réinitialisation du mot de passe utilisateur avec un jeton */}
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {/* Route conditionnelle pour afficher le profil si l'utilisateur est authentifié */}
                    {isAuthenticated && <Route path="/profile" element={<Profile />} />}
                    {/* Route conditionnelle pour rediriger vers la page de connexion si non authentifié */}
                    {!isAuthenticated && <Route path="/profile" element={<Navigate to="/login" />} />}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
