import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";

const TestGeneratorPage = () => {
  const [files, setFiles] = useState([]); // List of uploaded files
  const [selectedFileId, setSelectedFileId] = useState(null); // Selected file ID
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [generatedTest, setGeneratedTest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("https://forgeprep.net/api/files/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched files:", response.data); // Debugging log
        setFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to fetch files. Please try again.");
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
      const prompt = `Generate a ${difficulty} test on the topic "${topic}" with ${numQuestions} questions based on the selected study material.`;

      const response = await axios.post(
        "https://forgeprep.net/api/gpt/generate",
        {
          topic,
          difficulty,
          num_questions: numQuestions,
          study_material_id: selectedFileId,
          prompt,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && response.data.id) {
        setGeneratedTest(response.data);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Error generating test:", err);
      setError(err.response?.data?.message || "Failed to generate test. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body>
          <h2>Test Generator</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleGenerateTest}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Select
                value={selectedFileId || ""}
                onChange={(e) => setSelectedFileId(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Select a file --
                </option>
                {files.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.filename}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formTopic" className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDifficulty" className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formNumQuestions" className="mb-3">
              <Form.Label>Number of Questions</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Generate Test
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {generatedTest && (
        <Card className="mt-4">
          <Card.Body>
            <h3>Generated Test</h3>
            <pre>{JSON.stringify(generatedTest.metadata, null, 2)}</pre>
            <Button
              variant="success"
              className="mt-3"
              onClick={() => {
                window.location.href = `/take-test/${generatedTest.id}`;
              }}
            >
              Take Test
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TestGeneratorPage;
