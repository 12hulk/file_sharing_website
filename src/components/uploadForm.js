import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Fetch uploaded files from the backend
    useEffect(() => {
        const fetchUploadedFiles = async () => {
            try {
                const response = await axios.get('https://backend-file-hosting.vercel.app/api/files.js'); // Update with correct endpoint
                setUploadedFiles(response.data);
            } catch (error) {
                console.error("Error fetching files", error);
                setMessage("Error fetching uploaded files.");
            }
        };
        fetchUploadedFiles();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'https://backend-file-hosting.vercel.app/api/upload.js', // Replace with your upload API
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'file-name': file.name,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('File uploaded successfully!');
                setUploadedFiles([...uploadedFiles, { name: file.name, url: response.data.publicURL }]);
            } else {
                setMessage('File upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setMessage('File upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            setFile(null);
        }
    };

    return (
        <div>
            <h2>File Upload</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload File'}</button>
            </form>
            {message && <p>{message}</p>}
            {uploadedFiles.length > 0 && (
                <div>
                    <h3>Uploaded Files:</h3>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Upload;
