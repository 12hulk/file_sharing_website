import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Upload from '../components/uploadForm';
import Footer from '../components/footer';
import Session from 'react-session-api'; // Importing react-session-api

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated using react-session-api
        if (Session.get("isAuthenticated") !== "yes") {
            // If not authenticated, redirect to login page
            navigate('/login');
        }
    }, [navigate]); // Dependency array includes navigate

    function handleLogout() {
        // Log the current authentication status for debugging
        console.log("Logging out", Session.get("isAuthenticated"));

        // Set session to "no" to mark the user as logged out
        Session.set("isAuthenticated", "no");

        // Redirect to login page after logging out
        navigate('/login');
    }

    return (
        <div
            style={{
                textAlign: 'center',
                margin: '20px auto',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
            }}
        >
            <h2 style={{ color: '#4e54c8', margin: '20px 0' }}>Share Your Files</h2>

            <button
                onClick={handleLogout}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    float: "right",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginTop: "20px",
                }}
            >
                Logout
            </button>

            <Upload email={Session.get("email")} />
            <Footer />
        </div>
    );
};

export default Home;
