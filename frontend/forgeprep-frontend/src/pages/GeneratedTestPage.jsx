import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Alert,
  Spinner,
  Card,
  ListGroup,
} from "react-bootstrap";
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
    if (!test?.test_metadata?.questions?.length) {
      setError("Test is incomplete or contains no questions.");
      return;
    }

    navigate("/take-test", { state: { testId } });
  };

  const handleRegenerate = () => {
    navigate("/generate-test", {
      state: { fileId: test?.study_material_id },
    });
  };

  if (!testId) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Missing test ID. Please generate a test again.</Alert>
        <Button onClick={() => navigate("/dashboard")} variant="primary">
          Go Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </PageWrapper>
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
        {error && <Alert variant="warning">{error}</Alert>}

        <Button
          onClick={handleStartTest}
          variant="success"
          size="lg"
          className="me-3"
        >
          Start Test
        </Button>

        <Button
          onClick={handleRegenerate}
          variant="outline-danger"
          className="me-3"
        >
          Regenerate Test
        </Button>

        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default GeneratedTestPage;
