import React from 'react'; // React pour la construction de composant
import { createRoot } from 'react-dom/client'; // import de createRoot pour React 18
import './index.css'; // import de styles globaux (à définir d'ailleurs !!! )
import App from './App'; // composant principal de l'appli 
import reportWebVitals from './reportWebVitals'; // rapports de performance
import { ToastContainer } from 'react-toastify'; // conteneur Toast pour les notifs 
import 'react-toastify/dist/ReactToastify.css'; // styles pour les notifs Toast

// Récupérer l'élément root du DOM
const container = document.getElementById('root');
const root = createRoot(container); // Créer un root avec createRoot

// Rendre le composant principal App et le conteneur de Toast
root.render(
    <React.StrictMode>  
        <App />
        <ToastContainer />
    </React.StrictMode>
);

reportWebVitals(); // Appel de la fonction pour mesurer les perfs de l'app
