import React from 'react'; // React pour la construction de composant
import ReactDOM from 'react-dom'; // ReactDOM pour rendre les composants React dans le Dom
import './index.css'; // import de styles globaux (à définir d'ailleurs !!! )
import App from './App'; // composant principal de l'appli 
import reportWebVitals from './reportWebVitals'; // rapports de performance
import { ToastContainer } from 'react-toastify'; // conteneur Toast pour les notifs 
import 'react-toastify/dist/ReactToastify.css'; // styles pour les notifs Toast
// rendu du composant principal App et du conteneur de Toast dans le DOM
ReactDOM.render(
    <React.StrictMode>  
        <App />
        <ToastContainer />
    </React.StrictMode>,
    document.getElementById('root') // élément du Dom dans lequel rendre l'application
);

reportWebVitals(); // Appel de la fonction pour mesurer les perfs de l'app
