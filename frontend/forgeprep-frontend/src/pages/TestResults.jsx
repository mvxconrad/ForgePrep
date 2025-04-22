import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/apiService";
import { Container, Card, ListGroup, Spinner } from "react-bootstrap";
import PageWrapper from "../components/PageWrapper";

const TestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.result) {
      setTestResults([location.state.result]);
      setLoading(false);
    } else {
      fetchTestResults();
    }
  }, []);

  const fetchTestResults = async () => {
    try {
      const response = await api.get("/tests/results");
      setTestResults(response.data);
    } catch (err) {
      console.error("Error fetching test results:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container className="mt-4">
        <Card className="glass p-4">
          <h2>Test Results</h2>
          {testResults.length === 0 ? (
            <p>No test results found.</p>
          ) : (
            <ListGroup>
              {testResults.map((result, idx) => (
                <ListGroup.Item key={idx} className="bg-transparent text-white">
                  <strong>Test ID:</strong> {result.test_id} | <strong>Score:</strong> {result.score}%
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TestResults;
