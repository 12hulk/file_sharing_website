import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Session from 'react-session-api'; // Importing react-session-api

const Login = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://backend-file-hosting.vercel.app/api/login.js', {
                email,
                password,
            });
            Session.set("email", email);

            if (response.status === 200 && response.data.token === "yes") {
                console.log('Login successful:', response.data);
                localStorage.setItem("email", email); // Persist email in localStorage
                // Set session storage with react-session-api
                Session.set("isAuthenticated", response.data.token);

                console.log(Session.get("isAuthenticated"));
                // Optionally, redirect to a different page after login
                //   history.push("/home"); // Redirect to files page
                // Redirect to home page after successful login
                navigate('/home');
            }
        } catch (err) {
            console.error('Error during login:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Invalid email or password.');
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                background: "linear-gradient(135deg, #f9f9f9, #d9e4f5)",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#333',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div
                className="card"
                style={{
                    width: '400px',
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'white',
                }}
            >
                <h2
                    className="text-center mb-4"
                    style={{
                        color: '#4e54c8',
                        fontWeight: '700',
                    }}
                >
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={{ fontWeight: '600' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            style={{
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                padding: '10px',
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" style={{ fontWeight: '600' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            style={{
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                padding: '10px',
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{
                            borderRadius: '5px',
                            padding: '10px',
                            fontWeight: 'bold',
                            backgroundColor: '#4e54c8',
                            border: 'none',
                        }}
                    >
                        Log In
                    </button>
                    {error && (
                        <div
                            className="alert alert-danger mt-3"
                            style={{
                                fontSize: '0.9em',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </div>
                    )}
                </form>
                <div className="text-center mt-3">
                    <p style={{ fontSize: '0.85em', color: '#888' }}>
                        Don’t have an account?{' '}
                        <a href="/register" style={{ color: '#4e54c8', fontWeight: 'bold' }}>
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
