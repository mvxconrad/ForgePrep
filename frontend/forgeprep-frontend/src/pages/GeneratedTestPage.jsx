import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Alert, Spinner, Card, ListGroup } from "react-bootstrap";
import api from "../util/apiService";

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
    <Container className="mt-5">
      <h2 className="mb-4">🧠 Test Preview</h2>
      {test.test_metadata?.questions.map((q, index) => (
        <Card key={index} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Question {index + 1}</Card.Title>
            <Card.Text>{q.question}</Card.Text>
            {Array.isArray(q.options) && (
              <ListGroup variant="flush">
                {q.options.map((option, idx) => (
                  <ListGroup.Item key={idx}>{option}</ListGroup.Item>
                ))}
              </ListGroup>
            )}
            {q.answer && (
              <div className="mt-2 text-muted">
                <small>✅ Answer: <strong>{q.answer}</strong></small>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
      <div className="text-center mt-4">
        <Button onClick={handleStartTest} variant="success" size="lg">
          Start Test
        </Button>
      </div>
    </Container>
  );
};

export default GeneratedTestPage;
