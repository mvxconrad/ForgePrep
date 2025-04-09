import React, { useState } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";

const TestGeneratorPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [studyMaterialId, setStudyMaterialId] = useState(null); // Optional
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");

  const handleGenerateTest = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await axios.post(
        "https://forgeprep.net/api/gpt/generate",
        {
          topic,
          difficulty,
          num_questions: numQuestions ? parseInt(numQuestions) : null,
          study_material_id: studyMaterialId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { metadata } = response.data;
      setGeneratedQuestions(metadata.questions || metadata.raw_text || []);
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate the test. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Generate a Test</h1>
      <Card className="p-3 mb-4">
        <h3>Test Generator</h3>
        <Form>
          <Form.Group controlId="formTopic" className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDifficulty" className="mb-3">
            <Form.Label>Difficulty (Optional)</Form.Label>
            <Form.Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formNumQuestions" className="mb-3">
            <Form.Label>Number of Questions (Optional)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formStudyMaterialId" className="mb-3">
            <Form.Label>Study Material ID (Optional)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter study material ID"
              value={studyMaterialId || ""}
              onChange={(e) => setStudyMaterialId(e.target.value)}
            />
          </Form.Group>
          <Button onClick={handleGenerateTest} variant="primary">
            Generate Test
          </Button>
        </Form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Card>

      {generatedQuestions.length > 0 && (
        <Card className="p-3">
          <h3>Generated Questions</h3>
          <ListGroup>
            {generatedQuestions.map((question, index) => (
              <ListGroup.Item key={index}>{question}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
};

export default TestGeneratorPage;
