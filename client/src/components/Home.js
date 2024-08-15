import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../components/Home.css';

function Home() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchAcceptedProjects = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${apiUrl}/api/projects/accepted-projects`);
                console.log(res.data);
                setProjects(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching projects');
                console.error(err.response?.data);
            }
        };
        
        const checkUserRole = () => {
            const userRole = localStorage.getItem('role');
            setRole(userRole);
        };

        fetchAcceptedProjects();
        checkUserRole();
    }, []);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenue sur FinFinder</h1>
                <p>
                    Une plateforme dédiée à la protection des requins et de leurs habitats marins. 
                    Notre mission est de créer un écosystème où chercheurs, plongeurs, artistes et passionnés de la nature 
                    peuvent se rassembler pour soutenir la recherche et la conservation des requins.
                </p>
            </header>
            <nav className="home-navigation">
                <ul>
                    <li><Link to="/signup-donateur">Sign Up Donateur</Link></li>
                    <li><Link to="/signup-chercheur">Sign Up Chercheur</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/">Home</Link></li>
                    {role === 'Admin' && (
                        <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                    )}
                </ul>
            </nav>
            <main className="home-main">
                <section>
                    <h2>Unir la Communauté pour la Recherche et la Conservation</h2>
                    <p>
                        FinFinder permet aux scientifiques et aux experts de soumettre leurs projets de recherche sur les requins. 
                        Grâce à notre plateforme, ces projets peuvent recevoir le financement nécessaire pour avancer. 
                        Nous croyons fermement que chaque contribution compte et que, collectivement, nous pouvons faire une différence significative.
                    </p>
                </section>
                <section>
                    <h2>Financement Participatif et NFT Artistiques</h2>
                    <p>
                        Pour soutenir ces projets, FinFinder intègre des outils de financement participatif, y compris les dons et les abonnements. 
                        Nous avons également innové en introduisant les NFT artistiques. Ces NFT, créés par des artistes talentueux inspirés par la 
                        beauté des océans et de ses créatures, offrent une nouvelle manière de contribuer à la conservation des requins. 
                        En achetant un NFT, vous soutenez directement les projets de recherche tout en possédant une œuvre d'art unique.
                    </p>
                </section>
                <section>
                    <h2>Protéger les Requins et leur Habitat</h2>
                    <p>
                        Les requins jouent un rôle crucial dans l’équilibre des écosystèmes marins. Pourtant, ils sont souvent menacés par la surpêche, 
                        la pollution et le changement climatique. FinFinder s'engage à soutenir des initiatives qui visent à protéger ces animaux fascinants 
                        et leur environnement naturel. Nos projets couvrent une large gamme d'actions, de la recherche scientifique à la mise en œuvre de 
                        mesures de conservation.
                    </p>
                </section>
                <section>
                    <h2>Encourager la Participation Communautaire</h2>
                    <p>
                        Nous croyons en la force de la communauté. FinFinder propose des fonctionnalités permettant à chacun de s'impliquer activement 
                        dans la protection des requins. Que vous soyez un plongeur partageant vos observations, un scientifique menant des recherches, 
                        ou un citoyen passionné prêt à participer à des événements de sensibilisation, votre contribution est précieuse.
                    </p>
                </section>
                <section>
                    <h2>Une Plateforme Éducative et Engagée</h2>
                    <p>
                        En plus de soutenir les projets de conservation, FinFinder offre des ressources éducatives pour sensibiliser le public à l'importance 
                        des requins. Articles, vidéos, infographies et autres contenus pédagogiques sont disponibles pour aider à mieux comprendre ces créatures 
                        et les défis auxquels elles sont confrontées.
                    </p>
                </section>
                <section>
                    <h2>Sécurité et Transparence</h2>
                    <p>
                        Chez FinFinder, la sécurité et la transparence sont des priorités absolues. Nous comprenons l'importance de protéger les données et les transactions 
                        de nos utilisateurs. C'est pourquoi nous avons décidé d'intégrer la technologie blockchain dans notre plateforme.
                    </p>
                    <p>
                        La blockchain : une révolution pour la sécurité
                    </p>
                    <p>
                        La blockchain est une technologie décentralisée qui permet de sécuriser et de vérifier les transactions de manière transparente. Chaque transaction est 
                        enregistrée dans un bloc qui est ensuite lié à la chaîne de blocs précédents, créant ainsi une base de données immuable et infalsifiable.
                    </p>
                    <p>
                        Avantages de la blockchain pour FinFinder
                    </p>
                    <ul>
                        <li><strong>Sécurité renforcée :</strong></li>
                    </ul>
                    <p>
                        Les transactions effectuées via la blockchain sont cryptographiquement sécurisées, rendant presque impossible toute tentative de falsification ou de fraude.
                        Chaque transaction est vérifiée par un réseau de nœuds indépendants, garantissant ainsi l'intégrité et l'authenticité des données.
                    </p>
                    <ul>
                        <li><strong>Transparence totale :</strong></li>
                    </ul>
                    <p>
                        Toutes les transactions sont enregistrées de manière transparente et peuvent être consultées par n'importe qui sur le réseau. Cette transparence renforce 
                        la confiance des utilisateurs dans la plateforme. Les donateurs peuvent vérifier l'utilisation de leurs fonds en suivant les transactions sur la blockchain, 
                        assurant ainsi que les fonds sont utilisés de manière appropriée et pour les bonnes causes.
                    </p>
                    <ul>
                        <li><strong>Décentralisation :</strong></li>
                    </ul>
                    <p>
                        Contrairement aux systèmes centralisés, la blockchain ne repose pas sur une autorité unique. Cette décentralisation réduit les risques de corruption et d'abus de pouvoir.
                        Les décisions et les validations des transactions sont prises de manière collective, garantissant une gouvernance équitable et transparente.
                    </p>
                    <ul>
                        <li><strong>Traçabilité et immuabilité :</strong></li>
                    </ul>
                    <p>
                        La blockchain permet une traçabilité complète des transactions. Chaque mouvement de fonds est enregistré et peut être suivi, offrant ainsi une traçabilité inégalée. 
                        Une fois enregistrées, les transactions ne peuvent pas être modifiées ou supprimées, ce qui garantit leur immuabilité.
                    </p>
                    <p>
                        FinFinder et la blockchain
                    </p>
                    <p>
                        En intégrant la blockchain, FinFinder assure à ses utilisateurs que chaque don, chaque transaction et chaque interaction sur la plateforme est sécurisé, transparent et vérifiable. 
                        Cette technologie nous permet de bâtir une communauté de confiance où les chercheurs, les conservateurs et les donateurs peuvent collaborer en toute sérénité pour la préservation 
                        des requins et de leurs habitats.
                    </p>
                    <p>
                        Rejoignez-nous dans cette révolution technologique et contribuez à des projets de conservation avec la garantie que vos efforts et vos contributions sont protégés et utilisés 
                        de manière transparente et sécurisée.
                    </p>
                </section>
                <section>
                    <h2>Notre équipe</h2>
                    <p>
                        Nous sommes une équipe de passionnés de requins qui travaillent ensemble pour protéger ces animaux fascinants.
                    </p>
                </section>
                <section className="featured-projects">
                    <h2>Projets phares</h2>
                    <div className="featured-projects-list">
                        {error && <p className="error">{error}</p>}
                        {projects.map(project => (
                            <div key={project._id} className="featured-project">
                                <img src={`/${project.image}`} alt={project.title} />
                                <div className="featured-project-info">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <Link to={`/projects/${project._id}`}>Voir les détails</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="featured-projects-list">
                        {error && <p className="error">{error}</p>}
                        {projects.map(project => (
                            <div key={project._id} className="featured-project">
                                <img src={`/${project.image}`} alt={project.title} />
                                <div className="featured-project-info">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <Link to={`/projects/${project._id}`}>Voir les détails</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="home-footer">
                <p>&copy; 2024 FinFinder. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Home;
