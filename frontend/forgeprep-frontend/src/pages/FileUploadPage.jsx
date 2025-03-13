import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, ProgressBar, Table, Card } from "react-bootstrap";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileHistory, setFileHistory] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetchFileHistory();
  }, []);

  const fetchFileHistory = async () => {
    try {
      const response = await axios.get(
        `https://forgeprep.net/api/auth/files/`, // Updated API URL
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("API response:", response.data); // Debugging log
      setFileHistory(Array.isArray(response.data) ? response.data : []); // Ensure response data is an array
    } catch (error) {
      console.error("Error fetching file history:", error);
      setFileHistory([]); // Set to empty array on error
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `https://forgeprep.net/api/auth/files/upload/`, // Updated API URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      alert("File uploaded successfully!");
      setSelectedFile(null);
      setUploadProgress(0);
      fetchFileHistory(); // Refresh file history after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">File Upload</h1>

      <Card className="p-3 mb-4">
        <h3>Upload a File</h3>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Accepted file types: PDF, DOCX, TXT</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>

        {uploadProgress > 0 && (
          <ProgressBar
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className="mt-3"
          />
        )}
      </Card>

      {/* File Upload History */}
      <Card className="p-3">
        <h3>Upload History</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded On</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {fileHistory.length > 0 ? (
              fileHistory.map((file, index) => (
                <tr key={index}>
                  <td>{file.filename}</td>
                  <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No files uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default FileUpload;
