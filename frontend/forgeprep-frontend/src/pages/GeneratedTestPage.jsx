import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Alert, Spinner } from "react-bootstrap";
import api from "../util/apiService"; // Centralized API service

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
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading test data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Generated Test Preview</h1>
      <ul>
        {test.test_metadata?.questions.map((question, index) => (
          <li key={index} className="mb-3">
            <strong>{question.question || question.questionText}</strong>
            {Array.isArray(question.options) && (
              <ul>
                {question.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="text-center mt-4">
        <Button onClick={handleStartTest} variant="primary" size="lg">
          Start Test
        </Button>
      </div>
    </Container>
  );
};

export default GeneratedTestPage;
