import React from 'react';
import { Navigate } from 'react-router-dom'; // import de navigate pour redirection des utilisateurs non authentifiés
import PropTypes from 'prop-types'; //pour la validation des props

const PrivateRoute = ({ children }) => {
    // si l'utilisateur est auth en vérifiant si il y a 1 token dans localStorage
    const isAuthenticated = !!localStorage.getItem('token');
    // si il est auth, rend les composants enfants, sinon rediriger vers login
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// validation des props du composant PrivateRoute
PrivateRoute.propTypes = {  // Correction ici
    children: PropTypes.node.isRequired
};

export default PrivateRoute; // export pour utilisation ailleurs 
