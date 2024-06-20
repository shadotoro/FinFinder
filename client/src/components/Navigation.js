import React from 'react'; // import de Ract pour utilisation des composants
import { Link } from 'react-router-dom'; // import de Link pour la navigation entre les routes

// définition du composant de navigation et de la barre
function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation; // exportation pour utilisation ailleurs dans l'appli