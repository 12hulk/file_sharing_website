import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]); // To store and display uploaded files

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

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "https://backend-rust-theta-51.vercel.app/api/upload.js", // Use relative path to API endpoint
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Important for sending files
                        "file-name": file.name, // Send file name in headers (if needed)
                    },
                }
            );

            if (response.status === 200) {
                setMessage("File uploaded successfully!");
                // Assuming the response contains an array of uploaded files
                setUploadedFiles(response.data.files);
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

            {/* Display the list of uploaded files */}
            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3 style={{ textAlign: "center" }}>Uploaded Files:</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {uploadedFiles.map((file, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#4e54c8",
                                        textDecoration: "underline",
                                    }}
                                >
                                    {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};//hfsdjzfjsanjknksndkln

export default Upload;
