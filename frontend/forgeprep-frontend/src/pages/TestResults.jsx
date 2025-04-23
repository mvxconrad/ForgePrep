import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../util/apiService";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import styles from "./Dashboard.module.css"; // for glassCard styling
import backgroundImage from "../assets/background_abstract2.png";

const TestResults = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.result) {
      setTestResult(location.state.result);
      setLoading(false);
    } else {
      // fallback to result history if direct visit
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (!testResult) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">No result data found. Please take a test first.</Alert>
      </Container>
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
          <h2 className="fw-bold text-white mb-4">🧠 Test Results</h2>

          <h5 className="text-light mb-3">
            <Badge bg="success" className="me-2">Test ID: {testResult.test_id}</Badge>
            Score: <strong>{testResult.score}%</strong> (
            {testResult.correct} / {testResult.total})
          </h5>

          <ListGroup variant="flush">
            {testResult?.submitted_answers &&
              Object.entries(testResult.submitted_answers).map(([index, userAnswer], idx) => {
                const q = testResult?.test_metadata?.questions?.[index];
                const correct = q?.answer?.toLowerCase().trim() === userAnswer?.toLowerCase().trim();

                return (
                  <ListGroup.Item
                    key={idx}
                    className="bg-transparent text-light"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <p className="mb-1 fw-semibold">
                      {parseInt(index) + 1}. {q?.question}
                    </p>

                    {q?.options?.length > 0 && (
                      <ul className="mb-1">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}

                    <p className="mb-0">
                      <span className={`fw-bold ${correct ? "text-success" : "text-danger"}`}>
                        Your answer: {userAnswer || "—"}
                      </span>{" "}
                      {!correct && (
                        <span className="text-muted ms-2">
                          (Correct: <strong>{q?.answer || "?"}</strong>)
                        </span>
                      )}
                    </p>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </Card>
      </Container>
    </div>
  );
};

export default TestResults;
