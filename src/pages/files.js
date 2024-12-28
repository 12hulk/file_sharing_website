import React, { useEffect, useState } from "react";
import axios from "axios";
import Session from 'react-session-api'; // Importing react-session-api

const Files = () => {
    const [data, setFiles] = useState([]);
    const [message, setMessage] = useState("");


    try {
        // Make a GET request to fetch files for the logged-in user
        const response = await axios.get(
            'https://backend-file-hosting.vercel.app/api/files.js', // Your API endpoint
            { params: Session.get("userEmail") } // Pass email as a query parameter
        );

        if (response.status === 200) {
            setFiles(response.data.data || []); // Set files from response
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


return (
    <div>
        <h2>Your previous Files</h2>

        if( data.length) {
            <ul>
                {data.map((data) => (
                    <li key={data.id}>
                        <span>{data.file_name}</span>
                        <button
                            onClick={() => handleDownload(data.file_url, data.file_name)}
                        >
                            Download
                        </button>
                        <button onClick={() => handleDelete(data.file_name)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>}
        else {
            <p>No files found for this account.</p>
        }
    </div>
);


export default Files;
