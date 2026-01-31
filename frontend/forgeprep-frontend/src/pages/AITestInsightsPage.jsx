import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

const AITestInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://forgeprep.net/api/ai/insights", {
        withCredentials: true, // ✅ Use HttpOnly cookie auth
      });
      setInsights(response.data);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError("Failed to load AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">AI Test Insights</h2>
      {error && <p className="text-danger">{error}</p>}
      <Card className="glassCard">
        <Card.Body>
          {insights.length > 0 ? (
            <ListGroup variant="flush">
              {insights.map((insight, index) => (
                <ListGroup.Item key={index} className="bg-transparent text-white">
                  <strong>Topic:</strong> {insight.topic || "Unknown"} <br />
                  <strong>Created At:</strong>{" "}
                  {new Date(insight.created_at).toLocaleString()} <br />
                  <strong>Questions:</strong> {insight.questions.length} questions
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No insights available.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AITestInsightsPage;
