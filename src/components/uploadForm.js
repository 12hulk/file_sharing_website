import React, { useState, useEffect } from "react";
import axios from "axios";
import Session from 'react-session-api';
const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUploadedFiles = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "https://backend-file-hosting.vercel.app/api/getFiles.js"
                );
                setUploadedFiles(response.data.files || []); // Fallback if `files` is undefined
            } catch (error) {
                console.error("Error fetching files:", error);
                setMessage("Failed to fetch uploaded files.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUploadedFiles();
    }, []);

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
        formData.append("email", Session.get("email"));

        try {
            const response = await axios.post(
                "https://backend-file-hosting.vercel.app/api/upload.js",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                setMessage("File uploaded successfully!");
                setUploadedFiles((prev) => [
                    ...prev,
                    { name: file.name, url: response.data.publicURL },
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
                "https://backend-file-hosting.vercel.app/api/delete.js",
                { data: { filename } }
            );

            if (response.status === 200) {
                setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
                setMessage("File deleted successfully!");
            } else {
                setMessage("File deletion failed.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            setMessage("File deletion failed.");
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await axios.get(url, {
                responseType: "blob",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download Error:", error);
            setMessage("File download failed.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
            </form>
            <p>{message}</p>

            {isLoading ? (
                <p>Loading files...</p>
            ) : uploadedFiles.length > 0 ? (
                <ul>
                    {uploadedFiles.map((file) => (
                        <li key={file.name}>
                            <span>{file.name}</span>
                            <button onClick={() => handleDownload(file.url, file.name)}>
                                Download
                            </button>
                            <button onClick={() => handleDelete(file.name)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No files uploaded yet.</p>
            )}
        </div>
    );
};

export default Upload;
