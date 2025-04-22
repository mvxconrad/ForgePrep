import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../util/apiService";
import { Container, Card, Button, Form } from "react-bootstrap";

const TakeTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!testId) {
      setError("Missing test ID.");
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`);
        setTest(response.data);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError("Failed to load test. Please try again.");
      }
    };

    fetchTest();
  }, [testId]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitTest = async () => {
    try {
      const response = await api.post("/tests/submit", { testId, answers });
      navigate("/test-results", { state: { result: response.data } });
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
    }
  };

  if (!test) return <p>{error || "Loading test..."}</p>;

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <h2>{test.title || "Take Test"}</h2>
        {test.questions.map((q, idx) => (
          <Form.Group className="mb-3" key={q.id}>
            <Form.Label>
              {idx + 1}. {q.text}
            </Form.Label>
            <Form.Control
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </Form.Group>
        ))}
        <Button onClick={handleSubmitTest}>Submit Test</Button>
      </Card>
    </Container>
  );
};

export default TakeTestPage;
