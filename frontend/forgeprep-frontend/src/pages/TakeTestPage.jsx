import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../util/apiService";
import {
  Container,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import styles from "./Dashboard.module.css";
import backgroundImage from "../assets/background_abstract2.png";

const TakeTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!testId) {
      setError("Missing test ID.");
      setLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`);
        setTest(response.data);
      } catch (err) {
        console.error("Error fetching test:", err);
        setError("Failed to load test. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleChange = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const response = await api.post("/tests/submit", { testId, answers });
      navigate("/test-results", { state: { result: response.data } });
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", backgroundColor: "#0b0c10" }}
      >
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div
      className="bg-dark text-light"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Container className="py-5">
        <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
          <h2 className="fw-bold mb-4">Take Your Test</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {Array.isArray(test?.test_metadata?.questions) &&
          test.test_metadata.questions.length > 0 ? (
            <Form onSubmit={(e) => e.preventDefault()}>
              {test.test_metadata.questions.map((q, idx) => (
                <Form.Group className="mb-4" key={idx}>
                  <Form.Label className="text-white fw-semibold">
                    {idx + 1}. {q.question || q.text}
                  </Form.Label>
                  <Form.Control
                    className="bg-light"
                    type="text"
                    value={answers[idx] || ""}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    placeholder="Your answer"
                  />
                </Form.Group>
              ))}

              <div className="text-center">
                <Button
                  variant="primary"
                  className="px-5 py-2 fw-semibold"
                  onClick={handleSubmitTest}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Test"
                  )}
                </Button>
              </div>
            </Form>
          ) : (
            <p className="text-muted">No questions available for this test.</p>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default TakeTestPage;
