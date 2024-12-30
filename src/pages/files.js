import React, { useEffect, useState } from "react";
import axios from "axios";
import Session from "react-session-api"; // Importing react-session-api
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure you import Bootstrap styles

const Files = () => {
    const [data, setFiles] = useState([]); // State to hold files
    const [message, setMessage] = useState(""); // State for error or success messages
    const [isLoading, setIsLoading] = useState(true); // State to track loading
    const userEmail = localStorage.getItem('email') || Session.get("email"); // Load from localStorage if available
    // Fetch files on component mount or when userEmail changes
    useEffect(() => {
        const fetchFiles = async () => {
            if (!userEmail) {
                setMessage("Please log in to view your files.");
                setIsLoading(false);
                return;
            }

            try {
                // Make a GET request to fetch files for the logged-in user
                const response = await axios.get(
                    "https://backend-file-hosting.vercel.app/api/files.js", // Your API endpoint for fetching files
                    { params: { userEmail } } // Pass email as a query parameter
                );

                if (response.status === 200) {
                    setFiles(response.data.files || []); // Set files from the response
                } else {
                    setMessage("Failed to fetch files.");
                }
            } catch (error) {
                console.error("Error fetching files:", error);
                setMessage("Error fetching files. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, [userEmail]); // Re-fetch files when the userEmail changes

    const handleDownload = async (fileUrl, fileName) => {
        try {
            // Fetch the file data from the file URL and create a download link
            const response = await axios.get(fileUrl, { responseType: "blob" });
            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click(); // Trigger the download
        } catch (error) {
            console.error("Error downloading file:", error);
            setMessage("Error downloading file. Please try again.");
        }
    };

    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete(
                "https://backend-file-hosting.vercel.app/api/upload.js", // Endpoint for file deletion
                { data: { filename, userEmail } }
            );

            if (response.status === 200) {
                setFiles(data.filter((file) => file.file_name !== filename)); // Remove deleted file from the UI
                setMessage("File deleted successfully!");
            } else {
                setMessage("File deletion failed.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            setMessage("File deletion failed.");
        }
    };
    // Save email to localStorage if it's not already there
    if (userEmail && !localStorage.getItem('email')) {
        localStorage.setItem('email', userEmail); // Persist email
    }
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Your Previous Files</h2>

            {/* Display Messages */}
            {message && (
                <div className={`alert ${message.includes("failed") ? "alert-danger" : "alert-info"} text-center`} role="alert">
                    {message}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {data.length === 0 ? (
                        <p className="text-center">No files available. Please upload some files.</p>
                    ) : (
                        <ul className="list-group">
                            {data.map((file) => (
                                <li key={file.file_name} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{file.file_name}</span>
                                    <div>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleDownload(file.file_url, file.file_name)}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(file.file_name)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Files;
