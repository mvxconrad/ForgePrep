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
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || isUploading) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);
    setMessage("");

    const simulate = setInterval(() => {
      setUploadProgress((prev) => (prev >= 98 ? prev : prev + 3));
    }, 200);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/upload/scan/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      clearInterval(simulate);
      setUploadProgress(100);

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setUploadedFileId(data.file_id);
      setMessage("✅ File uploaded and scanned successfully!");
      setFile(null);

      await fetchHistory();
    } catch (err) {
      clearInterval(simulate);
      setUploadProgress(0);
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Check console.");
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 800);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/files/${fileId}`, {
        withCredentials: true,
      });
      setFileHistory((prev) => prev.filter((f) => f.file_id !== fileId));
    } catch (err) {
      console.error("Failed to delete file:", err);
      setMessage("❌ Failed to delete file.");
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
                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} disabled={isUploading} />
              </Form.Group>

              {file && (
                <Card className="bg-transparent text-white border-light-subtle p-3 mb-3">
                  <div><strong>Name:</strong> {file.name}</div>
                  <div><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</div>
                </Card>
              )}

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Button
                  type="submit"
                  variant="light"
                  className="text-dark fw-semibold"
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Scanning...
                    </>
                  ) : (
                    "Upload & Scan"
                  )}
                </Button>

                {uploadedFileId && (
                  <Button variant="success" onClick={handleGenerateTest}>
                    Generate Test
                  </Button>
                )}
              </div>

              {uploadProgress > 0 && (
                <ProgressBar
                  now={uploadProgress}
                  className="mt-3"
                  animated
                  variant={uploadProgress < 100 ? "info" : "success"}
                  label={`${uploadProgress.toFixed(0)}%`}
                />
              )}

              {message && (
                <div
                  className={`mt-3 fw-semibold ${
                    message.includes("✅") ? "text-success" : "text-danger"
                  }`}
                  style={{ fontSize: "1.1rem", textShadow: "0 0 6px rgba(255,255,255,0.2)" }}
                >
                  {message}
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>

        <Card className={`${styles.glassCard} p-4 border-0 shadow mt-5`}>
          <h4 className="fw-semibold mb-3 text-white">Upload History</h4>
          <Table hover responsive className="table-dark rounded overflow-hidden">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fileHistory.length > 0 ? (
                fileHistory.map((f, idx) => (
                  <tr key={idx}>
                    <td className="text-white">{f.filename}</td>
                    <td className="text-white">{new Date(f.uploadedAt).toLocaleString()}</td>
                    <td className="text-white">{f.size.toFixed(2)} KB</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(f.file_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No uploads yet.</td>
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
