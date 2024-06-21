import React from 'react';
import { Link } from 'react-router-dom';
import '';

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenue sur FinFinder</h1>
                <p>Notre mission est de soutenir la recherche et la conservation des requins.</p>
            </header>
            <nav className="home-navigation">
                <ul>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>
            <main className="home-main">
                <section>
                    <h2>À propos de nous</h2>
                    <p>FinFinder est une application qui permet aux chercheurs et aux plongeurs de partager des informations sur les requins.</p>
                </section>
                <section>
                    <h2>Notre mission</h2>
                    <p>Notre mission est de soutenir la recherche et la conservation des requins.</p>
                </section>
                <section>
                    <h2>Notre équipe</h2>
                    <p>Nous sommes une équipe de passionnés de requins qui travaillent ensemble pour protéger ces animaux fascinants.</p>
                </section>
                <section className="featured-projects">
                    <h2>Projets phares</h2>
                    <div className="featured-project">
                        <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/turtle-736885__340.jpg" alt="" />
                        <div className="featured-project-info">
                            <h3>Requin 1</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                    </div>
                    <div className="featured-project">
                        <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/turtle-736885__340.jpg" alt="" />
                        <div className="featured-project-info">
                            <h3>Requin 2</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
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