import React, { useState } from "react";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import Session from 'react-session-api'; // Importing react-session-api

const Upload = (userEmail) => {
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
        formData.append("userEmail", Session.get("userEmail"));

        try {
            const response = await axios.post(
                "https://backend-file-hosting.vercel.app/api/upload.js", // Use relative path to API endpoint
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Important for sending files
                        "file-name": file.name, // Send file name in headers (if needed)
                        "userEmail": Session.get("userEmail"),
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
                console.log("File Name:", response.data.fields);
                console.log("File Name:", response.data.fileName);
                console.log("Public URL:", response.data.publicURL);
                console.log("User Email:", response.data.userEmail);
                const supabase = createClient(
                    "https://ekdoxzpypavhtoklntqv.supabase.co",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZG94enB5cGF2aHRva2xudHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzQ3NDAsImV4cCI6MjA0ODY1MDc0MH0.FyHH1ee-dfBThvAUeL4SaqCO6sJZzQ-2Scnnv-bInOA"
                );
                // Insert file metadata into the 'files' table
                const { error: dbError } = await supabase
                    .from('files')
                    .insert({
                        user_email: response.data.userEmail,
                        file_name: response.data.fileName,
                        file_url: response.data.publicURL,
                        uploaded_at: new Date(),
                    });

                if (dbError) {
                    return res.status(500).json({ error: "Error inserting file metadata" });
                }

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

    const handleDownload = async (filename) => {
        const supabase = createClient(
            "https://ekdoxzpypavhtoklntqv.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZG94enB5cGF2aHRva2xudHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzQ3NDAsImV4cCI6MjA0ODY1MDc0MH0.FyHH1ee-dfBThvAUeL4SaqCO6sJZzQ-2Scnnv-bInOA"
        );

        // Fetch public URL for the file
        const { data, error } = supabase.storage.from('uploads').getPublicUrl(filename);

        if (error) {
            console.error("Error fetching public URL:", error.message);
            return;
        }

        // Ensure the file exists in the storage bucket before proceeding
        if (!data) {
            console.error(`No public URL returned for file: ${filename}. The file might not exist in the bucket.`);
            return;
        }

        const publicURL = data.publicUrl;
        console.log("Public URL:", publicURL); // Log the correct URL

        window.open(publicURL, '_blank');
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
                                {/* Instead of opening a new tab, we download the file directly */}
                                <button onClick={() => handleDownload(file.name)}>
                                    Download {file.name}
                                </button>
                                <button onClick={() => handleDelete(file.name)}>
                                    Delete:{file.name}
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
