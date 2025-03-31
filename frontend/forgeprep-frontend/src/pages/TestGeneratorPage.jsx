import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import testImage from "../assets/test.png"; // Import the image

const TestGenerator = () => {
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [category, setCategory] = useState("Math");
  const [generatedTest, setGeneratedTest] = useState(null);

  const handleGenerateTest = async () => {
    try {
      const response = await axios.post(
        `https://forgeprep.net/api/generate-test/`, // Updated API URL
        {
          difficulty,
          numQuestions,
          questionType,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        body: JSON.stringify(newTest),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTest = await response.json();
      console.log("Test added:", addedTest); // Debugging log
      setTests([...tests, addedTest]);
      setNewTest({ name: "", subject: "", questions: [] });
    } catch (err) {
      console.error("Error adding test:", err);
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Test Generator</h1>

      <Card className="p-3 mb-4">
        <div className="text-center mb-4">
          <img src={testImage} alt="Test Generator" style={{ width: "150px" }} />
        </div>
        <h3>Generate Your Test</h3>
        <Form.Group controlId="formDifficulty" className="mb-3">
          <Form.Label>Difficulty Level</Form.Label>
          <Form.Control
            as="select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formNumQuestions" className="mb-3">
          <Form.Label>Number of Questions</Form.Label>
          <Form.Control
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min={1}
            max={50}
          />
        </Form.Group>

        <Form.Group controlId="formQuestionType" className="mb-3">
          <Form.Label>Question Type</Form.Label>
          <DropdownButton
            id="dropdown-basic-button"
            title={questionType}
            onSelect={(e) => setQuestionType(e)}
          >
            <Dropdown.Item eventKey="Multiple Choice">Multiple Choice</Dropdown.Item>
            <Dropdown.Item eventKey="True/False">True/False</Dropdown.Item>
            <Dropdown.Item eventKey="Short Answer">Short Answer</Dropdown.Item>
          </DropdownButton>
        </Form.Group>

        <Form.Group controlId="formCategory" className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Math</option>
            <option>Science</option>
            <option>History</option>
            <option>Literature</option>
          </Form.Control>
        </Form.Group>

        <Button onClick={handleGenerateTest}>Generate Test</Button>
      </Card>

      {/* Display generated test */}
      {generatedTest && (
        <Card className="p-3">
          <h3>Generated Test</h3>
          <ul>
            {generatedTest.questions.map((question, index) => (
              <li key={index}>
                <strong>{question.questionText}</strong>
                <ul>
                  {question.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Container>
  );
};

export default TestGenerator;
