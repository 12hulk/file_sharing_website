import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        setIsUploading(true);

        try {
            const response = await axios.post(
                "https://backend-rust-theta-51.vercel.app/api/upload.js", // Use relative path to API endpoint
                file,
                {
                    headers: {
                        "Content-Type": file.type,
                        "file-name": file.name, // Send file name in headers
                    },
                }
            );

            if (response.status === 200) {
                setMessage(`File uploaded successfully! Public URL: ${response.data.publicURL}`);
            } else {
                setMessage("File upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            setMessage("File upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            setFile(null);
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
