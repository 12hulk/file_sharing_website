import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]); // To store and display uploaded files

    // Handle file change event
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
    };

    // Handle file upload
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
                "https://backend-file-hosting.vercel.app/api/upload.js", // API endpoint
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
                // Assuming the response contains the file's public URL
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

    // Handle file deletion
    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete(
                "https://backend-file-hosting.vercel.app/api/upload.js", // API endpoint
                { data: { filename } } // Pass filename in the body for deletion
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

    // Handle file download
    const handleDownload = (url) => {
        console.log("Download URL:", url);
        window.open(url, "_blank"); // Open the file URL in a new tab
    };

    return (
        <div>
            {/* Upload Form */}
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
            </form>
            <p>{message}</p>

            {/* Display uploaded files */}
            <div>
                {uploadedFiles.length > 0 && (
                    <ul>
                        {uploadedFiles.map((file) => (
                            <li key={file.name}>
                                <a href="#" onClick={() => handleDownload(file.url)}>
                                    {file.name} (Download)
                                </a>
                                <button onClick={() => handleDelete(file.name)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Upload;
