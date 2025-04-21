import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/apiService";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const TestGeneratorPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedTest, setGeneratedTest] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get("/files");
        setUploadedFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleGenerateTest = async (e) => {
    e.preventDefault();
    setError("");
    setGeneratedTest(null);

    if (!selectedFileId) {
      setError("Please select a file to generate the test.");
      return;
    }

    try {
      const prompt = `Generate a ${difficulty} test on the topic \"${topic}\" with ${numQuestions} questions based on the selected study material.`;
      const response = await api.post("/gpt/generate", {
        topic,
        difficulty,
        num_questions: numQuestions,
        study_material_id: selectedFileId,
        prompt,
      });

      const { test_id, metadata } = response.data;
      setGeneratedTest({ id: test_id, metadata });
      navigate("/generated-test", { state: { testId: test_id } });
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate test. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <h2>Test Generator</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleGenerateTest}>
          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Control
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Difficulty</Form.Label>
            <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Number of Questions</Form.Label>
            <Form.Control
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min={1}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Study Material</Form.Label>
            <Form.Select value={selectedFileId} onChange={(e) => setSelectedFileId(e.target.value)}>
              <option value="">-- Select a File --</option>
              {uploadedFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Generate Test
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default TestGeneratorPage;