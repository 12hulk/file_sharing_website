import React, { useState } from "react";
import axios from "axios";
import Footer from '../components/footer';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("https://backend-file-hosting.vercel.app/api/register.js", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 201) {
                setSuccess(true);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed!");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f9f9f9, #d9e4f5)",
            }}
        >

            <div
                style={{
                    width: "400px",
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                }}
            >
                <h2 style={{ textAlign: "center", color: "#4e54c8" }}>Sign Up</h2>
                {error && (
                    <div
                        style={{
                            color: "#ff4d4f",
                            background: "#ffe6e6",
                            padding: "10px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}
                {success && (
                    <div
                        style={{
                            color: "#28a745",
                            background: "#e6f4ea",
                            padding: "10px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            textAlign: "center",
                        }}
                    >
                        Registration successful! <a href="/login">Login</a>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="name" style={{ fontWeight: "600" }}>
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="email" style={{ fontWeight: "600" }}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="password" style={{ fontWeight: "600" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="confirmPassword" style={{ fontWeight: "600" }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#4e54c8",
                            color: "white",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Sign Up
                    </button>
                    <p style={{ marginTop: "15px", textAlign: "center", fontSize: "0.9em" }}>
                        Already have an account?{" "}
                        <a href="/login" style={{ color: "#4e54c8", fontWeight: "bold" }}>
                            Login
                        </a>
                    </p>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
