import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import api from "../util/apiService";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css"; // for glassCard styling
import backgroundImage from "../assets/background_abstract2.png";

const TestGeneratorPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/`, {
          credentials: "include",
        });
        const data = await response.json();
        setUploadedFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch uploaded files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleGenerateTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const prompt = `Generate a ${difficulty} test on the topic "${topic}" with ${numQuestions} questions based on the selected study material.`;
      const response = await api.post("/gpt/generate", {
        file_id: parseInt(selectedFileId),
        prompt,
      });

      const testId = response.data.test_id;
      navigate("/generated-test", { state: { testId } });
    } catch (err) {
      console.error("Error generating test:", err);
      setError("❌ Failed to generate test. Try again.");
    } finally {
      setLoading(false);
    }
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
          <h2 className="fw-bold text-white mb-4">🧠 Generate a Custom Test</h2>
          {error && <Alert variant="danger" className="fw-semibold">{error}</Alert>}

          <Form onSubmit={handleGenerateTest}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white fw-semibold">Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. International Business"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white fw-semibold">Difficulty</Form.Label>
              <Form.Select
                className="bg-dark text-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white fw-semibold">Number of Questions</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-white fw-semibold">Select Study Material</Form.Label>
              <Form.Select
                className="bg-dark text-white"
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
                required
              >
                <option value="">-- Select a file --</option>
                {uploadedFiles.map((f) => (
                  <option key={f.file_id} value={f.file_id}>
                    {f.filename}
                  </option>
                ))}
              </Form.Select>
              {selectedFileId && (
                <div className="text-info small mt-2">
                  Selected: {uploadedFiles.find(f => f.file_id === selectedFileId)?.filename}
                </div>
              )}
            </Form.Group>

            <Button type="submit" disabled={loading} className="w-100 fw-semibold btn-light text-dark">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Generating...
                </>
              ) : (
                "Generate Test"
              )}
            </Button>
          </Form>
        </Card>
      </Container>

      {/* Modal Spinner Overlay */}
      <Modal show={loading} backdrop="static" centered contentClassName="bg-transparent border-0 text-center">
        <div className="text-white">
          <Spinner animation="border" variant="light" size="lg" />
          <p className="mt-3 fw-semibold">Generating test with GPT... Please wait.</p>
        </div>
      </Modal>
    </div>
  );
};

export default TestGeneratorPage;
