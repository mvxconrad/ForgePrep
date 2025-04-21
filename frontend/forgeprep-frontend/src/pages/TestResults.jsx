import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/apiService";
import { Container, Card, ListGroup } from "react-bootstrap";

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

  if (loading) return <p>Loading results...</p>;

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <h2>Test Results</h2>
        {testResults.length === 0 ? (
          <p>No test results found.</p>
        ) : (
          <ListGroup>
            {testResults.map((result, idx) => (
              <ListGroup.Item key={idx}>
                <strong>Test ID:</strong> {result.test_id} | <strong>Score:</strong> {result.score}%
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default TestResults;
