import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, ProgressBar, Table, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import backgroundImage from "../assets/background_abstract2.png";

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileHistory, setFileHistory] = useState([]);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/files/`, {
          withCredentials: true,
        });
        setFileHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch history failed:", err);
        setFileHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/upload/scan/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed.");
      }

      const data = await res.json();
      setUploadedFileId(data.file_id);
      setMessage("✅ File uploaded and scanned successfully!");
      setFile(null);
      setUploadProgress(0);

      setFileHistory((prev) => [
        ...prev,
        {
          filename: file.name,
          size: file.size / 1024,
          uploadedAt: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Check console.");
    }
  };

  const handleGenerateTest = () => {
    navigate("/testgenerator", { state: { fileId: uploadedFileId } });
  };

  return (
    <div
      className="bg-dark text-light"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="py-5">
        <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
          <Card.Body>
            <h3 className="fw-bold mb-4 text-white">Upload Study Guide</h3>
            <Form onSubmit={handleFileUpload}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Upload a PDF file</Form.Label>
                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
              </Form.Group>

              {file && (
                <Card className="bg-transparent border-light-subtle p-3 mb-3">
                  <div><strong>Name:</strong> {file.name}</div>
                  <div><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</div>
                </Card>
              )}

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Button type="submit" variant="light" className="text-dark fw-semibold" disabled={!file}>
                  Upload & Scan
                </Button>
                {uploadedFileId && (
                  <Button variant="success" onClick={handleGenerateTest}>
                    Generate Test
                  </Button>
                )}
              </div>

              {uploadProgress > 0 && (
                <ProgressBar now={uploadProgress} className="mt-3" animated />
              )}

              {message && (
                <div className={`mt-3 fw-semibold ${message.includes("✅") ? "text-success" : "text-danger"}`}>
                  {message}
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>

        <Card className={`${styles.glassCard} p-4 border-0 shadow mt-5`}>
          <h4 className="fw-semibold mb-3 text-white">Upload History</h4>
          <Table striped hover responsive className="text-white">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {fileHistory.length > 0 ? (
                fileHistory.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.filename}</td>
                    <td>{new Date(f.uploadedAt).toLocaleString()}</td>
                    <td>{f.size.toFixed(2)} KB</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No uploads yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </div>
  );
};

export default FileUploadPage;
