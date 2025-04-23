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
import styles from "./Dashboard.module.css";
import backgroundImage from "../assets/background_abstract2.png";

const TestResults = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.result) {
      setTestResult(location.state.result);
    }
    setLoading(false);
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

  const questions = testResult?.test_metadata?.questions || [];
  const answers = testResult?.submitted_answers || {};

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

          <h5 className="text-light mb-4">
            <Badge bg="success" className="me-2">Test ID: {testResult.test_id}</Badge>
            Score: <strong>{testResult.score}%</strong> (
            {testResult.correct} / {testResult.total})
          </h5>

          <ListGroup variant="flush">
            {questions.map((q, index) => {
              const userAnswer = answers[index.toString()] || "";
              const isCorrect =
                q?.answer?.toLowerCase().trim() === userAnswer?.toLowerCase().trim();

              return (
                <ListGroup.Item
                  key={index}
                  className="bg-transparent text-light"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="mb-2 fw-semibold">
                    {index + 1}. {q?.question || "No question text"}
                  </div>

                  <ul className="ps-3 mb-2">
                    {q?.options?.map((opt, i) => {
                      const isSelected = opt === userAnswer;
                      const isAnswer = opt === q?.answer;
                      const classes = isSelected
                        ? isCorrect
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                        : isAnswer && !isCorrect
                        ? "text-info"
                        : "text-light";

                      return (
                        <li key={i} className={`mb-1 ${classes}`}>
                          {opt}
                          {isSelected && " (Your answer)"}
                          {!isSelected && isAnswer && !isCorrect && " (Correct)"}
                        </li>
                      );
                    })}
                  </ul>

                  {!isCorrect && (
                    <div className="text-muted small">
                      Correct answer: <strong>{q?.answer || "?"}</strong>
                    </div>
                  )}
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
