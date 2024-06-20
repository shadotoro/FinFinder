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
    const isAuthenticated = !!localStorage.getItem('token');
    console.log('App component rendered');
    return (
        <Router>
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/update-profile" element={<UpdateProfile />} />
                    <Route path="/reset-password" element={<RequestResetPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {isAuthenticated && <Route path="/profile" element={<Profile />} />}
                    {!isAuthenticated && <Route path="/profile" element={<Navigate to="/login" />} />}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
