import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    {isAuthenticated && <Route path="/profile" element={<Profile />} />}
                    {!isAuthenticated && <Route path="/profile" element={<Navigate to="/login" />} />}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
