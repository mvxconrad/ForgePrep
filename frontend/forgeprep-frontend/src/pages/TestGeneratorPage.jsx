import React, { useState } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TestGeneratorPage = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [category, setCategory] = useState("General Knowledge");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerateTest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/tests/generate",
        { difficulty, numQuestions, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const test = response.data;
      navigate("/generated-test", { state: { test } }); // Redirect to GeneratedTestPage
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate the test. Please try again.");
    }
  };

  const handleSaveTemplate = () => {
    // Logic for saving the template
    console.log("Template saved!");
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Test Generator</h1>
      <Card className="p-3 mb-4">
        <h3>Generate a Test</h3>
        <Form>
          {/* Difficulty Selection */}
          <Form.Group controlId="formDifficulty" className="mb-3">
            <Form.Label>Select Difficulty</Form.Label>
            <Form.Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </Form.Group>

          {/* Number of Questions */}
          <Form.Group controlId="formNumQuestions" className="mb-3">
            <Form.Label>Number of Questions</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="50"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </Form.Group>

          {/* Category Selection */}
          <Form.Group controlId="formCategory" className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General Knowledge">General Knowledge</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
              <option value="Literature">Literature</option>
            </Form.Select>
          </Form.Group>

          <Button onClick={handleGenerateTest} variant="primary">
            Generate Test
          </Button>
          <Button variant="secondary" onClick={handleSaveTemplate}>
            Save as Template
          </Button>
        </Form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Card>

      <Card className="mb-4">
        <Card.Header>Test Preview</Card.Header>
        <Card.Body>
          <p>Difficulty: {difficulty}</p>
          <p>Number of Questions: {numQuestions}</p>
          <p>Category: {category}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestGeneratorPage;
