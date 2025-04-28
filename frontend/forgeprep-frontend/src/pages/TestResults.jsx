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
      setLoading(false);
    } else {
      fetchLatestResult();
    }
  }, []);

  const fetchLatestResult = async () => {
    try {
      const res = await api.get("/tests/results");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setTestResult(res.data[0]); // Most recent first
      }
    } catch (err) {
      console.error("Error fetching test results:", err);
    } finally {
      setLoading(false);
    }
  };

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
        <Alert variant="danger">
          No test results found. Please take a test first.
        </Alert>
      </Container>
    );
  }

  const { test_id, score, correct, total, test_metadata, submitted_answers } = testResult;
  const questions = test_metadata?.questions || [];
  const answers = submitted_answers || {};

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
          <h2 className="fw-bold text-white mb-4">📊 Test Results</h2>

          <h5 className="text-light mb-4">
            <Badge bg="secondary" className="me-2">Test ID: {test_id}</Badge>
            Score: <strong>{score}%</strong> ({correct} / {total})
          </h5>

          <ListGroup variant="flush">
            {questions.map((q, index) => {
              const userAnswer = answers[index.toString()] || null;
              const correctAnswer = q?.answer || "";
              const isCorrect =
                userAnswer &&
                correctAnswer &&
                userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

              return (
                <ListGroup.Item
                  key={index}
                  className="bg-transparent text-light"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="mb-2 fw-semibold">
                    {index + 1}. {q?.question || "Untitled Question"}
                  </div>

                  <ul className="ps-3 mb-2">
                    {q?.options?.map((opt, i) => {
                      const selected = userAnswer === opt;
                      const isActualAnswer = correctAnswer === opt;
                      const showCorrect = !isCorrect && isActualAnswer;

                      let className = "text-light";
                      if (selected && isCorrect) className = "text-success fw-bold";
                      else if (selected && !isCorrect) className = "text-danger fw-bold";
                      else if (showCorrect) className = "text-info fw-semibold";

                      return (
                        <li key={i} className={className}>
                          {opt}
                          {selected && " (Your Answer)"}
                          {showCorrect && " (Correct Answer)"}
                        </li>
                      );
                    })}
                  </ul>

                  {!userAnswer && (
                    <p className="text-muted small fst-italic">No answer selected.</p>
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
