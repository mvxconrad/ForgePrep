import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TakeTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { test: initialTest, testId } = location.state || {}; // Test data passed from the previous page

  const [test, setTest] = useState(initialTest);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!test) {
      const fetchTest = async () => {
        try {
          const response = await axios.get(`https://forgeprep.net/api/tests/${testId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setTest(response.data);
        } catch (err) {
          console.error("Error fetching test:", err);
          setError("Failed to load test. Please try again.");
        }
      };

      fetchTest();
    }
  }, [test, testId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmitTest = async () => {
    try {
      const response = await axios.post(
        "https://forgeprep.net/api/tests/submit",
        { testId, answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/test-results");
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  if (!test) {
    return <p>No test data available.</p>;
  }

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