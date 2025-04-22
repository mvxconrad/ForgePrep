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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
    <PageWrapper>
      <Container className="mt-4">
        <h2>AI Test Insights</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card className="glass">
          <Card.Body>
            <ListGroup>
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <ListGroup.Item key={index} className="bg-transparent text-white">
                    <strong>Topic:</strong> {insight.topic || "Unknown"} <br />
                    <strong>Created At:</strong> {new Date(insight.created_at).toLocaleString()} <br />
                    <strong>Questions:</strong> {insight.questions.length} questions
                  </ListGroup.Item>
                ))
              ) : (
                <p>No insights available.</p>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default AITestInsightsPage;