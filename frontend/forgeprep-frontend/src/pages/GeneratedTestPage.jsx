import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Alert } from "react-bootstrap";
import api from "../utils/apiService"; // Centralized API service

const GeneratedTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [error, setError] = useState("");

  const testId = location.state?.testId;

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`);
        setTest(response.data);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError("Failed to load test data. Please try again.");
      }
    };

    if (testId) {
      fetchTest();
    } else {
      setError("No test ID provided.");
    }
  }, [testId]);

  const handleStartTest = () => {
    navigate("/take-test", { state: { testId } });
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!test) {
    return (
      <Container className="mt-4">
        <p>Loading test data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Generated Test</h1>
      <ul>
        {test.questions.map((question, index) => (
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
      <Button onClick={handleStartTest} variant="primary">
        Start Test
      </Button>
    </Container>
  );
};

export default GeneratedTestPage;