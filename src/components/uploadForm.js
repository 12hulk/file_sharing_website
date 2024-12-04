import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        try {
            // Make sure this endpoint handles storing the file in your database
            const response = await axios.post(
                "https://backend-rust-theta-51.vercel.app/api/upload.js", // Update with your correct API endpoint
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                setMessage("File uploaded successfully!");
            } else {
                setMessage("File upload failed. Please try again.");
            }
            setFile(null);
        } catch (error) {
            setMessage("File upload failed.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "30px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2 style={{ textAlign: "center", color: "#4e54c8" }}>File Upload</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#4e54c8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
            </form>
            {message && (
                <p
                    style={{
                        textAlign: "center",
                        color: message.includes("success") ? "green" : "red",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default Upload;
