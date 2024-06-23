import React from 'react'; // import de Ract pour utilisation des composants
import { Link } from 'react-router-dom'; // import de Link pour la navigation entre les routes

// définition du composant de navigation et de la barre
function Navigation() {
    const role = localStorage.getItem('role');
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup-donateur">Sign Up Donateur</Link></li>
                <li><Link to="/signup-chercheur">Sign Up Chercheur</Link></li>
                <li><Link to="/login">Login</Link></li>
                {role === 'Chercheur' && <li><Link to="/chercheurs-only">Chercheurs only</Link></li>}
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation; // exportation pour utilisation ailleurs dans l'appli