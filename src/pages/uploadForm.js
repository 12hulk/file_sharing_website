import React, { useState } from "react";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import Session from 'react-session-api';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure you import Bootstrap styles

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userEmail", Session.get("email"));

        try {
            const response = await axios.post(
                "https://backend-file-hosting.vercel.app/api/upload.js",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "file-name": file.name,
                        "userEmail": Session.get("email"),
                    },
                }
            );

            if (response.status === 200) {
                setMessage("File uploaded successfully!");
                setUploadedFiles((prev) => [
                    ...prev,
                    { name: file.name, url: response.data.fileUrl },
                ]);
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

    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete(
                "https://backend-file-hosting.vercel.app/api/upload.js",
                { data: { filename, userEmail: Session.get("email") } }
            );

            if (response.status === 200) {
                setUploadedFiles(uploadedFiles.filter((file) => file.name !== filename));
                setMessage("File deleted successfully!");
            } else {
                setMessage("File deletion failed.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            setMessage("File deletion failed.");
        }
    };

    const handleDownload = async (filename) => {
        const supabase = createClient(
            "https://ekdoxzpypavhtoklntqv.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZG94enB5cGF2aHRva2xudHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzQ3NDAsImV4cCI6MjA0ODY1MDc0MH0.FyHH1ee-dfBThvAUeL4SaqCO6sJZzQ-2Scnnv-bInOA"
        );

        const { data, error } = supabase.storage.from('uploads').getPublicUrl(filename);

        if (error || !data) {
            console.error("Error fetching public URL:", error?.message || "File not found");
            return;
        }

        const publicURL = data.publicUrl;

        try {
            const response = await axios.get(publicURL, { responseType: "blob" });
            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
            setMessage("Error downloading file. Please try again.");
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">File Upload</h2>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
            </form>

            {/* Message */}
            {message && (
                <div className="alert alert-info text-center" role="alert">
                    {message}
                </div>
            )}

            {/* Display Uploaded Files */}
            <div>
                <h4>Recently Uploaded Files:</h4>
                {uploadedFiles.length > 0 ? (
                    <ul className="list-group">
                        {uploadedFiles.map((file) => (
                            <li
                                key={file.name}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span>{file.name}</span>
                                <div>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleDownload(file.name)}
                                    >
                                        Download
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(file.name)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No files uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default Upload;
