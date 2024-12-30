import React, { useEffect, useState } from "react";
import axios from "axios";
import Session from "react-session-api"; // Importing react-session-api

const Files = () => {
    const [data, setFiles] = useState([]); // State to hold files
    const [message, setMessage] = useState(""); // State for error or success messages
    const userEmail = Session.get("email"); // Get user email from session

    // Fetch files on component mount or when userEmail changes
    useEffect(() => {
        const fetchFiles = async () => {
            if (!userEmail) {
                setMessage("Please log in to view your files.");
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

    return (
        <div>
            <h2>Your Previous Files</h2>
            {message && <p>{message}</p>} {/* Display any messages */}

            {data.length === 0 ? (
                <p>No files available. Please upload some files.</p>
            ) : (
                <ul>
                    {data.map((file) => (
                        <li key={file.file_name}>
                            <span>{file.file_name}</span>
                            <button
                                onClick={() => handleDownload(file.file_url, file.file_name)}
                            >
                                Download
                            </button>
                            <button onClick={() => handleDelete(file.file_name)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Files;
