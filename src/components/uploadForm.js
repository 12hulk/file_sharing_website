import React, { useState, useEffect } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("https://backend-rust-theta-51.vercel.app/api/files.js");
                setUploadedFiles(response.data);
            } catch (error) {
                setMessage("Failed to load file list.");
                console.error(error);
            }
        };
        fetchFiles();
    }, []);

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
            await axios.post("https://backend-rust-theta-51.vercel.app/api/upload.js", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("File uploaded successfully!");
            setFile(null);

            // Refresh file list
            const fileListResponse = await axios.get("https://backend-rust-theta-51.vercel.app/api/files.js");
            setUploadedFiles(fileListResponse.data);
        } catch (error) {
            setMessage("File upload failed.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (filename) => {
        if (!window.confirm(`Are you sure you want to delete '${filename}'?`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/files/${filename}`);
            setMessage(`File '${filename}' deleted successfully!`);

            // Refresh file list
            const fileListResponse = await axios.get("http://localhost:5000/files");
            setUploadedFiles(fileListResponse.data);
        } catch (error) {
            setMessage("Failed to delete the file.");
            console.error(error);
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

            <h3 style={{ color: "#4e54c8" }}>Uploaded Files</h3>
            {uploadedFiles.length === 0 ? (
                <p style={{ textAlign: "center" }}>No files uploaded yet.</p>
            ) : (
                <ul
                    style={{
                        listStyleType: "none",
                        padding: "0",
                        borderTop: "1px solid #ddd",
                        marginTop: "10px",
                    }}
                >
                    {uploadedFiles.map((file, index) => (
                        <li
                            key={index}
                            style={{
                                padding: "10px 0",
                                borderBottom: "1px solid #ddd",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>{file.filename}</span>
                            <div>
                                <a
                                    href={`http://localhost:5000/files/${file.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textDecoration: "none",
                                        color: "#4e54c8",
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                    }}
                                >
                                    Download
                                </a>
                                <button
                                    onClick={() => handleDelete(file.filename)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#ff4d4d",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Upload;
