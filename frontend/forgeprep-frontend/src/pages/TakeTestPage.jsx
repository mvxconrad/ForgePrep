import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const TakeTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {}; // Test data passed from the previous page

  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  if (!test) {
    return <p>No test data available.</p>;
  }

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmitTest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://forgeprep.net/api/tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testId: test.id, answers }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Test submitted successfully:", result);
      navigate("/test-results", { state: { result } }); // Redirect to test results page
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit the test. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h1>{test.name}</h1>
      <p>{test.description}</p>
      {error && <p className="text-danger">{error}</p>}
      {test.questions.map((question, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <h5>{index + 1}. {question.questionText}</h5>
            <Form>
              {question.options.map((option, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  name={`question-${index}`}
                  label={option}
                  value={option}
                  onChange={() => handleAnswerChange(question.id, option)}
                />
              ))}
            </Form>
          </Card.Body>
        </Card>
      ))}
      <Button onClick={handleSubmitTest} variant="success">
        Submit Test
      </Button>
    </Container>
  );
};

export default TakeTestPage;