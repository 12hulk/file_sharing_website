import React, { useEffect, useState } from "react";
import axios from "axios";
import Session from "react-session-api"; // Importing react-session-api

const Files = () => {
    const [data, setFiles] = useState([]);
    const [message, setMessage] = useState("");
    const id = Session.get("id"); // Get user email from session

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Make a GET request to fetch files for the logged-in user
                const response = await axios.get(
                    "https://backend-file-hosting.vercel.app/api/files.js", // Your API endpoint
                    { params: { id } } // Pass email as a query parameter
                );

                if (response.status === 200) {
                    setFiles(response.data.data || []); // Set files from response
                } else {
                    setMessage("Failed to fetch files.");
                }
            } catch (error) {
                console.error("Error fetching files:", error);
                setMessage("Error fetching files. Please try again.");
            }
        };

        fetchFiles();
    }, [userEmail]); // Dependency on userEmail to re-fetch when it changes

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
                "https://backend-file-hosting.vercel.app/api/upload.js",
                { data: { filename, userEmail } }
            );

            if (response.status === 200) {
                setFiles(data.filter((file) => file.file_name !== filename)); // Filter out the deleted file
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
            {data.length > 0 ? (
                <ul>
                    {data.map((file) => (
                        <li key={file.id}>
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
            ) : (
                <p>No files found for this account.</p>
            )}
            {message && <p>{message}</p>} {/* Show message if exists */}
        </div>
    );
};

export default Files;
