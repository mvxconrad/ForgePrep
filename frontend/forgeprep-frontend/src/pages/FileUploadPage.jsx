import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  ProgressBar,
  Table,
  Card
} from "react-bootstrap";
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
        paddingBottom: "3rem",
      }}
    >
      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Card className={`${styles.glassCard} border-0 shadow p-4`}>
          <Card.Body>
            <h3 className="fw-bold text-white mb-4">Upload Study Guide</h3>
            <Form onSubmit={handleFileUpload}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Upload a PDF file</Form.Label>
                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} className="glass" />
              </Form.Group>

              {file && (
                <Card className="mb-3 p-3 glass border-0">
                  <strong className="text-white">Name:</strong> {file.name}<br />
                  <strong className="text-white">Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </Card>
              )}

              <div className="d-flex flex-wrap gap-2">
                <Button type="submit" variant="light" className="fw-semibold text-dark" disabled={!file}>
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

              {message && <p className="mt-3 text-white">{message}</p>}
            </Form>
          </Card.Body>
        </Card>

        <Card className={`${styles.glassCard} mt-5 p-4`}>
          <h4 className="fw-bold text-white mb-3">Upload History</h4>
          <Table responsive bordered variant="dark" className="glass text-white">
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
