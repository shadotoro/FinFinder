import React from 'react'; // import de Ract pour utilisation des composants
import { Link } from 'react-router-dom'; // import de Link pour la navigation entre les routes
import './Navigation.css';
// définition du composant de navigation et de la barre
function Navigation() {
    const role = localStorage.getItem('role');
    return (
        <nav className="nav-container">
            <ul className="nav-list">
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup-donateur">Sign Up Donateur</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup-chercheur">Sign Up Chercheur</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                {role === 'Chercheur' && <li className="nav-item"><Link className="nav-link" to="/chercheurs-only">Chercheurs only</Link></li>}
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation; // exportation pour utilisation ailleurs dans l'appli