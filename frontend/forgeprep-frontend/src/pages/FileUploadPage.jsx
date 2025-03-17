import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, ProgressBar, Table, Card } from "react-bootstrap";
import studyGuideImage from "../assets/study_guide.jpg"; // Import the image

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileHistory, setFileHistory] = useState([]); // Initialize as an empty array

  useEffect(() => {
      const fetchFileHistory = async () => {
    try {
      const response = await axios.get(
        `https://forgeprep.net/files/`, // Updated API URL
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

    fetchFileHistory();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://forgeprep.net/files/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage("File uploaded successfully!");
      setFile(null);
      setUploadProgress(0);
      // Add the uploaded file to the file history
      const newFile = {
        filename: file.name,
        uploadedAt: new Date(),
        size: file.size / 1024,
      };
      setFileHistory([...fileHistory, newFile]);
    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("Error uploading file.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body>
          <h2>File Upload</h2>
          <Form onSubmit={handleFileUpload}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Choose file</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Upload</Button>
          </Form>
          {message && <p className="mt-3">{message}</p>}
        </Card.Body>
      </Card>

      <Card className="p-3 mb-4">
        <div className="text-center mb-4">
          <img src={studyGuideImage} alt="Study Guide" style={{ width: "150px" }} />
        </div>
        <h3>Upload a File</h3>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Accepted file types: PDF, DOCX, TXT</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button onClick={handleFileUpload} disabled={!file}>
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
                  <td>{file.size.toFixed(2)} KB</td>
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
      <Card className="p-3 mb-4">
        <div className="text-center mb-4">
          <img src={studyGuideImage} alt="Study Guide" style={{ width: "150px" }} />
        </div>
        <h3>Upload a File</h3>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Accepted file types: PDF, DOCX, TXT</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button onClick={handleFileUpload} disabled={!file}>
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
                  <td>{file.size.toFixed(2)} KB</td>
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


export default FileUploadPage;
