import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Upload from '../components/uploadForm';
import Footer from '../components/footer';
import { ReactSession } from "react-client-session";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (ReactSession.get("isAuthenticated") !== "yes") {
            navigate('/login');
        }
    }, [navigate]); // Only runs when `navigate` changes

    function handleLogout() {
        console.log(ReactSession.get("isAuthenticated"));
        ReactSession.set("isAuthenticated", "no");
        navigate('/Login');
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
            <Upload />
            <Footer />
        </div>
    );
};

export default Home;
